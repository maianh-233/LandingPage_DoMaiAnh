export default function PriceSummary({ order }) {
  if (!order) return null;

  const subtotal = Number(order.subtotal ?? 0);
  const discountTotal = Number(order.discount_total ?? 0);
  const shippingFee = Number(order.shipping_fee ?? 0);
  const tax = Number(order.tax ?? 0);
  const total = Number(order.total ?? 0);

  return (
    <div className="space-y-3 text-sm">
      <Row label="Tạm tính" value={subtotal} />
      <Row label="Giảm giá" value={-discountTotal} green />
      <Row label="Phí ship" value={shippingFee} />
      <Row label="Thuế" value={tax} />

      <hr className="border-zinc-700" />

      <div className="flex justify-between text-lg font-bold">
        <span>Tổng</span>
        <span>{total.toLocaleString()} ₫</span>
      </div>
    </div>
  );
}

const Row = ({ label, value, green }) => {
  const safeValue = Number(value ?? 0);

  return (
    <div className={`flex justify-between ${green && "text-green-400"}`}>
      <span>{label}</span>
      <span>{safeValue.toLocaleString()} ₫</span>
    </div>
  );
};
