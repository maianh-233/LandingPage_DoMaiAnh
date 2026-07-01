const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// In-memory store for the demo auth flow. This keeps the feature functional even when no database is configured.
const users = [];
const sessions = new Map();

function hashPassword(password) {
  // Hash the password with a salt so we do not store plain text passwords.
  return crypto.scryptSync(password, "lunaria-auth-salt", 64).toString("hex");
}

function createToken() {
  // Create a lightweight random token for the current session.
  return crypto.randomBytes(24).toString("hex");
}

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
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

router.post("/register", (req, res) => {
  // Create a new account after validating incoming data.
  const errors = validateRegisterPayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const existingUser = users.find((user) => user.email === req.body.email || user.phone === req.body.phone);
  if (existingUser) {
    return res.status(409).json({ message: "Email hoặc số điện thoại đã tồn tại." });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: req.body.phone.trim(),
    gender: normalizeGender(req.body.gender),
    dateOfBirth: req.body.dateOfBirth,
    passwordHash: hashPassword(req.body.password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  const token = createToken();
  sessions.set(token, newUser.id);

  return res.status(201).json({
    message: "Đăng ký thành công.",
    user: sanitizeUser(newUser),
    token,
  });
});

router.post("/login", (req, res) => {
  // Authenticate a user and create a session token for subsequent requests.
  const errors = validateLoginPayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const user = users.find((item) => item.email === req.body.email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const isPasswordValid = hashPassword(req.body.password) === user.passwordHash;
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const token = createToken();
  sessions.set(token, user.id);

  return res.json({
    message: "Đăng nhập thành công.",
    user: sanitizeUser(user),
    token,
  });
});

router.get("/me", (req, res) => {
  // Return the currently authenticated user based on the bearer token.
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  const userId = sessions.get(token);
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });
  }

  return res.json({ user: sanitizeUser(user) });
});

router.post("/logout", (req, res) => {
  // Remove the session token so the client can no longer access protected endpoints.
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (token) {
    sessions.delete(token);
  }

  return res.json({ message: "Đăng xuất thành công." });
});

module.exports = router;
