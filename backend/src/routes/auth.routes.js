const express = require("express");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { requireAuth, sanitizeUser, hashPassword } = require("../utils/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

function createToken() {
  // Random token for the current session.
  return crypto.randomBytes(24).toString("hex");
}


function normalizeGender(gender) {
  const normalized = String(gender || "").trim().toUpperCase();

  if (normalized === "MALE" || normalized === "NAM") {
    return "MALE";
  }

  if (normalized === "FEMALE" || normalized === "NU") {
    return "FEMALE";
  }

  if (normalized === "OTHER" || normalized === "KHAC") {
    return "OTHER";
  }

  return "OTHER";
}

function validateRegisterPayload(payload) {
  const errors = {};

  if (!payload.fullName || String(payload.fullName).trim().length < 2) {
    errors.fullName = "Họ tên phải có ít nhất 2 ký tự.";
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!payload.phone || !/^0\d{9,10}$/.test(payload.phone)) {
    errors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.";
  }

  if (!payload.password || payload.password.length < 6) {
    errors.password = "Mật khẩu phải có tối thiểu 6 ký tự.";
  }

  if (!payload.gender) {
    errors.gender = "Vui lòng chọn giới tính hợp lệ.";
  }

  if (!payload.dateOfBirth) {
    errors.dateOfBirth = "Vui lòng chọn ngày sinh.";
  }

  return errors;
}

function validateLoginPayload(payload) {
  const errors = {};

  if (!payload.email) {
    errors.email = "Email là bắt buộc.";
  }

  if (!payload.password) {
    errors.password = "Mật khẩu là bắt buộc.";
  }

  return errors;
}

router.post("/register", async (req, res) => {
  const errors = validateRegisterPayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const email = req.body.email.trim().toLowerCase();
  const phone = req.body.phone.trim();

  const existingByEmail = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  const existingByPhone = await prisma.user.findUnique({ where: { phone } }).catch(() => null);

  if (existingByEmail || existingByPhone) {
    return res.status(409).json({ message: "Email hoặc số điện thoại đã tồn tại." });
  }

  const token = createToken();

  const user = await prisma.user.create({
    data: {
      fullName: req.body.fullName.trim(),
      email,
      phone,
      gender: normalizeGender(req.body.gender),
      dateOfBirth: new Date(req.body.dateOfBirth),
      passwordHash: hashPassword(req.body.password),
    },
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
    },
  });

  return res.status(201).json({
    message: "Đăng ký thành công.",
    user: sanitizeUser(user),
    token,
  });
});

router.post("/login", async (req, res) => {
  const errors = validateLoginPayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const email = req.body.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } }).catch(() => null);

  if (!user) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const isPasswordValid = hashPassword(req.body.password) === user.passwordHash;
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const token = createToken();

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
    },
  });

  // update lastLogin (optional)
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  }).catch(() => null);

  return res.json({
    message: "Đăng nhập thành công.",
    user: sanitizeUser(user),
    token,
  });
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  }).catch(() => null);

  if (!session || !session.user) {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });
  }

  return res.json({ user: sanitizeUser(session.user) });
});

router.post("/logout", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.json({ message: "Đăng xuất thành công." });
  }

  await prisma.session.delete({ where: { token } }).catch(() => null);
  return res.json({ message: "Đăng xuất thành công." });
});

function validateProfilePayload(payload) {
  const errors = {};

  if (!payload.fullName || String(payload.fullName).trim().length < 2) {
    errors.fullName = "Họ tên phải có ít nhất 2 ký tự.";
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!payload.phone || !/^0\d{9,10}$/.test(String(payload.phone).trim())) {
    errors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.";
  }

  if (!payload.dateOfBirth) {
    errors.dateOfBirth = "Vui lòng chọn ngày sinh.";
  }

  if (payload.password && payload.password.length < 6) {
    errors.password = "Mật khẩu phải có tối thiểu 6 ký tự.";
  }

  return errors;
}

router.put("/profile", requireAuth, async (req, res) => {
  const errors = validateProfilePayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const email = req.body.email.trim().toLowerCase();
  const phone = req.body.phone.trim();

  const existingByEmail = await prisma.user.findFirst({
    where: { email, NOT: { id: req.user.id } },
  }).catch(() => null);

  const existingByPhone = await prisma.user.findFirst({
    where: { phone, NOT: { id: req.user.id } },
  }).catch(() => null);

  if (existingByEmail || existingByPhone) {
    return res.status(409).json({ message: "Email hoặc số điện thoại đã tồn tại." });
  }

  const updateData = {
    fullName: req.body.fullName.trim(),
    email,
    phone,
    dateOfBirth: new Date(req.body.dateOfBirth),
  };

  if (req.body.password) {
    updateData.passwordHash = hashPassword(req.body.password);
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
  });

  return res.json({
    message: "Cập nhật thông tin thành công.",
    user: sanitizeUser(user),
  });
});


module.exports = router;
