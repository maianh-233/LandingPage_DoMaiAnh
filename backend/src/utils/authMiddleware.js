const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return null;
  }

  const session = await prisma.session
    .findUnique({
      where: { token },
      include: { user: true },
    })
    .catch(() => null);

  return session?.user || null;
}

async function requireAuth(req, res, next) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  req.user = user;
  return next();
}

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function hashPassword(password) {
  const crypto = require("crypto");
  return crypto.scryptSync(password, "lunaria-auth-salt", 64).toString("hex");
}

module.exports = {
  getUserFromRequest,
  requireAuth,
  sanitizeUser,
  hashPassword,
};
