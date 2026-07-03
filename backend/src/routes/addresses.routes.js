const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { requireAuth } = require("../utils/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

function formatAddress(address) {
  return {
    id: address.id,
    user_id: address.userId,
    receiver_name: address.receiverName,
    receiver_phone: address.receiverPhone,
    province: address.province || "",
    district: address.district || "",
    ward: address.ward || "",
    address_line: address.addressLine,
    postal_code: address.postalCode || "",
    is_default: address.isDefault,
    address_type: address.addressType,
  };
}

function validateAddressPayload(payload) {
  const errors = {};

  if (!payload.receiver_name || String(payload.receiver_name).trim().length < 2) {
    errors.receiver_name = "Tên người nhận phải có ít nhất 2 ký tự.";
  }

  if (!payload.receiver_phone || !/^0\d{9,10}$/.test(String(payload.receiver_phone).trim())) {
    errors.receiver_phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.";
  }

  if (!payload.address_line || !String(payload.address_line).trim()) {
    errors.address_line = "Vui lòng nhập địa chỉ chi tiết.";
  }

  if (!payload.province || !String(payload.province).trim()) {
    errors.province = "Vui lòng nhập Tỉnh / Thành phố.";
  }

  if (!payload.district || !String(payload.district).trim()) {
    errors.district = "Vui lòng nhập Quận / Huyện.";
  }

  if (!payload.ward || !String(payload.ward).trim()) {
    errors.ward = "Vui lòng nhập Phường / Xã.";
  }

  const validTypes = ["HOME", "WORK", "OTHER"];
  if (payload.address_type && !validTypes.includes(payload.address_type)) {
    errors.address_type = "Loại địa chỉ không hợp lệ.";
  }

  return errors;
}

router.get("/", requireAuth, async (req, res) => {
  const addresses = await prisma.customerAddress.findMany({
    where: { userId: req.user.id },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });

  return res.json({ addresses: addresses.map(formatAddress) });
});

router.post("/", requireAuth, async (req, res) => {
  const errors = validateAddressPayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const body = req.body;
  const existingCount = await prisma.customerAddress.count({
    where: { userId: req.user.id },
  });

  const address = await prisma.customerAddress.create({
    data: {
      userId: req.user.id,
      receiverName: body.receiver_name.trim(),
      receiverPhone: body.receiver_phone.trim(),
      province: body.province.trim(),
      district: body.district.trim(),
      ward: body.ward.trim(),
      addressLine: body.address_line.trim(),
      postalCode: body.postal_code?.trim() || null,
      addressType: body.address_type || "HOME",
      isDefault: existingCount === 0,
    },
  });

  return res.status(201).json({
    message: "Thêm địa chỉ thành công.",
    address: formatAddress(address),
  });
});

router.patch("/:id/default", requireAuth, async (req, res) => {
  const address = await prisma.customerAddress.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!address) {
    return res.status(404).json({ message: "Không tìm thấy địa chỉ." });
  }

  await prisma.$transaction([
    prisma.customerAddress.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    }),
    prisma.customerAddress.update({
      where: { id: address.id },
      data: { isDefault: true },
    }),
  ]);

  const updated = await prisma.customerAddress.findUnique({
    where: { id: address.id },
  });

  return res.json({
    message: "Đã đặt làm địa chỉ mặc định.",
    address: formatAddress(updated),
  });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const address = await prisma.customerAddress.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!address) {
    return res.status(404).json({ message: "Không tìm thấy địa chỉ." });
  }

  await prisma.customerAddress.delete({ where: { id: address.id } });

  if (address.isDefault) {
    const nextDefault = await prisma.customerAddress.findFirst({
      where: { userId: req.user.id },
      orderBy: { id: "desc" },
    });

    if (nextDefault) {
      await prisma.customerAddress.update({
        where: { id: nextDefault.id },
        data: { isDefault: true },
      });
    }
  }

  return res.json({ message: "Xóa địa chỉ thành công." });
});



router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderCode: true,
        status: true,
        paymentStatus: true,
        subtotal: true,
        discountTotal: true,
        shippingFee: true,
        tax: true,
        totalAmount: true,
        createdAt: true,

        // promotion vẫn lấy để hiển thị "Đã áp dụng mã"
        promotions: {
          select: {
            promotionCode: true,
            discountAmount: true,
          },
        },
      },
    });

    return res.json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng",
    });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customerAddress: true,

        items: {
          orderBy: { createdAt: "asc" },
        },

        promotions: {
          select: {
            promotionId: true,
            promotionCode: true,
            discountAmount: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json({ order });
  } catch (error) {
    console.error("Get order detail failed:", error);
    return res.status(500).json({
      message: "Không thể lấy chi tiết đơn hàng",
    });
  }
});

module.exports = router;
