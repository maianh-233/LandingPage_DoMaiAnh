const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Create order
router.post("/", async (req, res) => {
  // NOTE: route này tạo order dựa trên payload từ client.
  // Theo yêu cầu: không kiểm tra tồn kho.

  try {
    const {
      userId,
      customerAddressId,
      note,
      items,
      promotions = [],
      shippingFee,
    } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    const variantIds = items.map(i => i.productVariantId).filter(Boolean);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    let subtotal = 0;

    const orderItemsData = items.map(item => {
      const variant = variants.find(v => v.id === item.productVariantId);
      if (!variant) throw new Error("Không tìm thấy product variant");

      const price = Number(variant.price);
      const total = price * item.quantity;
      subtotal += total;

      return {
        productId: variant.productId,
        productVariantId: variant.id,
        productName: variant.product.name,
        storage: variant.storage,
        imageUrl: variant.imageUrl,
        price,
        quantity: item.quantity,
        total,
      };
    });

    let discountTotal = 0;
    const orderPromotionData = [];

    if (promotions.length > 0) {
      const promotionIds = promotions.map(p => p.promotionId);

      const promotionEntities = await prisma.promotion.findMany({
        where: { id: { in: promotionIds } },
      });

      for (const promo of promotionEntities) {
        let discountAmount = 0;

        if (promo.discountType === "PERCENT") {
          discountAmount = (subtotal * Number(promo.discountValue)) / 100;
          if (promo.maxDiscount) {
            discountAmount = Math.min(discountAmount, Number(promo.maxDiscount));
          }
        } else {
          discountAmount = Number(promo.discountValue);
        }

        discountTotal += discountAmount;

        orderPromotionData.push({
          promotionId: promo.id,
          promotionCode: promo.code,
          discountAmount,
        });
      }
    }

    // Since this is "Xác nhận thanh toán", set confirmed/paid.
    const order = await prisma.order.create({
      data: {
        orderCode: `ORD-${Date.now()}`,
        userId,
        customerAddressId,
        note,
        subtotal,
        discountTotal,
        tax: 0,
        shippingFee: shippingFee != null ? Number(shippingFee) : 30000,
        totalAmount: subtotal - discountTotal + (shippingFee != null ? Number(shippingFee) : 30000),
        status: "CONFIRMED",
        paymentStatus: "PAID",
        items: { create: orderItemsData },
        promotions: { create: orderPromotionData },
      },
      include: {
        items: true,
        promotions: true,
        customerAddress: true,
      },
    });

    return res.status(201).json({ order });
  } catch (error) {
    console.error("Create order failed", error);
    return res.status(500).json({ message: error.message });
  }
});

// Get orders for current user
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập." });

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    }).catch(() => null);

    if (!session?.user) return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" },
      include: {
        items: true,
        promotions: true,
        customerAddress: true,
      },
    });

    const mapped = orders.map(o => ({
      id: o.id,
      order_code: o.orderCode,
      created_at: o.createdAt,
      status: o.status,
      payment_status: o.paymentStatus,
      order_type: "ONLINE",
      subtotal: o.subtotal,
      discount_total: o.discountTotal,
      shipping_fee: o.shippingFee,
      total_amount: o.totalAmount,
      note: o.note,
      item_count: o.items?.reduce((s, it) => s + (it.quantity || 0), 0) ?? 0,
      thumbnail: o.items?.[0]?.imageUrl ?? null,
    }));

    return res.json({ orders: mapped });
  } catch (err) {
    console.error("Get my orders failed", err);
    return res.status(500).json({ message: err.message });
  }
});

// Get order detail by orderCode
router.get("/:orderCode", async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: true,
        promotions: true,
        customerAddress: true,
      },
    });

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Map to format used by UI
    const mapped = {
      id: order.id,
      code: order.orderCode,
      status: order.status,
      paymentStatus: order.paymentStatus,
      order_type: "ONLINE",
      subtotal: order.subtotal,
      discount_total: order.discountTotal,
      tax: order.tax,
      shipping_fee: order.shippingFee,
      total_amount: order.totalAmount,
      note: order.note,
      shipping_address: order.customerAddress
        ? {
            id: order.customerAddress.id,
            receiver_name: order.customerAddress.receiverName,
            receiver_phone: order.customerAddress.receiverPhone,
            province: order.customerAddress.province,
            district: order.customerAddress.district,
            ward: order.customerAddress.ward,
            address_line: order.customerAddress.addressLine,
          }
        : null,
      promotions: (order.promotions || []).map(p => ({
        code: p.promotionCode || p.promotionId,
        name: p.promotionCode || p.promotionId,
        discount: Number(p.discountAmount || 0),
        promotionId: p.promotionId,
      })),
      items: (order.items || []).map(it => ({
        name: it.productName,
        imageUrl: it.imageUrl,
        quantity: it.quantity,
        price: Number(it.price || 0),
        color: it.storage ? it.storage : "",
        size: it.storage || "",
      })),
      // Timeline/mock fields
      status_history: [],
      payments: [],
    };

    return res.json(mapped);
  } catch (err) {
    console.error("Get order detail failed", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
