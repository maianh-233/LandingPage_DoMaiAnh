export const orderData = {
  subtotal: 1890000,
  discount_total: 320000,
  shipping_fee: 35000,
  tax: 45000,
  items: [
    {
      name: "iPhone 15 Pro Max",
      price: 34990000,
      quantity: 1,
      color: "Titan Tự Nhiên",
      size: "256GB",
      imageUrl: "https://picsum.photos/id/180/80",
    },
    {
      name: "MacBook Air M2",
      price: 28990000,
      quantity: 1,
      color: "Midnight",
      size: "8GB / 256GB",
      imageUrl: "https://picsum.photos/id/48/80",
    },
  ],
  promotions: [
    { code: "FASHION20", name: "Giảm 20%", discount: 250000 },
    { code: "FREESHIP", name: "Miễn phí vận chuyển", discount: 35000 },
    { code: "VIP10", name: "VIP giảm thêm 10%", discount: 35000 },
  ],
};

export const savedAddresses = [
  {
    id: "addr1",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: "0987654321",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    address_line: "123 Nguyễn Huệ",
    latitude: 10.7769,
    longitude: 106.7009,
    is_default: true,
  },
    {
    id: "addr2",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: "0987654321",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    address_line: "123 Nguyễn Huệ",
    latitude: 10.7769,
    longitude: 106.7009,
    is_default: true,
  },
];

export const store = {
  name: "Chi nhánh Quận 1",
  address: "45 Lê Lợi, Q1, TP.HCM",
  phone: "028 3824 1234",
  latitude: 10.7762,
  longitude: 106.701,
};