const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

function mapDiscountType(uiValue) {
  // UI: percent | cash
  // DB enum: PERCENT | FIXED
  const v = String(uiValue || "").trim().toLowerCase();
  if (v === "percent") return "PERCENT";
  if (v === "cash") return "FIXED";
  return null;
}

router.get("/promotions", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 8);
    const search = String(req.query.search || "").trim();
    const discountTypeUi = String(req.query.discountType || "").trim();

    const dateFromRaw = req.query.dateFrom ? String(req.query.dateFrom) : "";
    const dateToRaw = req.query.dateTo ? String(req.query.dateTo) : "";

    const discountTypeDb = mapDiscountType(discountTypeUi);

    const dateFrom = dateFromRaw ? new Date(dateFromRaw) : null;
    const dateTo = dateToRaw ? new Date(dateToRaw) : null;

    const where = {};

    if (search) {
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (discountTypeDb) {
      where.discountType = discountTypeDb;
    }

    // Match current UI logic: compare with start_date
    if (dateFrom || dateTo) {
      where.AND = where.AND || [];
      where.AND.push({
        startDate: {
          ...(dateFrom ? { gte: dateFrom } : {}),
          ...(dateTo ? { lte: dateTo } : {}),
        },
      });
    }

    const totalItems = await prisma.promotion.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(page, totalPages);

    const promotions = await prisma.promotion.findMany({
      where,
      skip: (safePage - 1) * limit,
      take: limit,
      orderBy: { startDate: "desc" },
    });

    const mapped = promotions.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      discount_type: p.discountType === "PERCENT" ? "percent" : "cash",
      discount_value: Number(p.discountValue),
      start_date: p.startDate,
      end_date: p.endDate,
      min_order_value: Number(p.minOrderValue),
      // DB schema doesn't have active; we can derive from current time if desired.
      active: p.startDate <= new Date() && p.endDate >= new Date(),
    }));

    return res.json({
      promotions: mapped,
      pagination: {
        page: safePage,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to load promotions", error);
    return res.status(500).json({ message: "Không thể tải khuyến mãi" });
  }
});

/**
 * Validate áp dụng khuyến mãi theo DB
 * body: { code, subtotal }
 */
router.post("/promotions/apply", async (req, res) => {
  try {
    const code = String(req.body?.code || "").trim().toUpperCase();
    const subtotal = Number(req.body?.subtotal ?? 0);

    if (!code) {
      return res.status(400).json({ ok: false, message: "Thiếu mã khuyến mãi" });
    }

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Subtotal không hợp lệ" });
    }

    const now = new Date();

    const promotion = await prisma.promotion.findFirst({
      where: { code: { equals: code, mode: "insensitive" } },
    });

    if (!promotion) {
      return res.status(200).json({ ok: false, message: "Khuyến mãi không tồn tại" });
    }

    const isActive = promotion.startDate <= now && promotion.endDate >= now;
    if (!isActive) {
      return res.status(200).json({ ok: false, message: "Khuyến mãi không còn hiệu lực" });
    }

    // min_order_value áp dụng theo subtotal (không gồm phí ship)
    if (subtotal < Number(promotion.minOrderValue)) {
      return res.status(200).json({ ok: false, message: "Đơn chưa đủ giá trị tối thiểu" });
    }

    // Tính discount
    let discountAmount = 0;
    if (promotion.discountType === "PERCENT") {
      discountAmount = (subtotal * Number(promotion.discountValue)) / 100;
    } else {
      discountAmount = Number(promotion.discountValue);
    }

    // maxDiscount nếu có
    if (promotion.maxDiscount != null) {
      discountAmount = Math.min(discountAmount, Number(promotion.maxDiscount));
    }

    // không cho discount vượt quá subtotal
    discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

    return res.status(200).json({
      ok: true,
      promotion: {
        code: promotion.code,
        name: promotion.name,
        discountType: promotion.discountType,
        discountValue: Number(promotion.discountValue),
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Failed to apply promotion", error);
    return res.status(500).json({ ok: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;


