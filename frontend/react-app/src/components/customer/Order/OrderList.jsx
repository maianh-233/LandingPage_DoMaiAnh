// OrderList.jsx
import OrderCard from "./OrderCard";

export default function OrderList({ orders, onChat, onCancel, onOpen }) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onChat={onChat}
          onCancel={onCancel}
          onOpen={onOpen}   // 👈 TRUYỀN XUỐNG
        />
      ))}
    </div>
  );
}