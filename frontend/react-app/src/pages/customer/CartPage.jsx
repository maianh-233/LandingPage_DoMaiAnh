import { useMemo, useState } from "react";
import CartItem from "../../components/customer/CartComponent/CartItem";
import OrderSummary from "../../components/customer/CartComponent/OrderSummary";

const VALID_PROMOS = {
  SALE20: 670000,
  HELLO50: 500000,
  FREESHIP: 300000,
  SUMMER25: 837500,
  VIP10: 335000,
};

export default function CartPage() {
  const [cart, setCart] = useState([
  {
    id: 101,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphone",
    color: "Titanium Black",
    storage: "256GB",
    price: 34990000,
    quantity: 1,
    warranty: "12 months",
    image: "https://picsum.photos/300/300?random=11",
    checked: true,
  },
  {
    id: 102,
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptop",
    color: "Silver",
    ram: "16GB",
    storage: "512GB SSD",
    price: 32990000,
    quantity: 1,
    warranty: "12 months",
    image: "https://picsum.photos/300/300?random=12",
    checked: true,
  },
  {
    id: 103,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    color: "Black",
    price: 8490000,
    quantity: 2,
    warranty: "12 months",
    image: "https://picsum.photos/300/300?random=13",
    checked: true,
  },
  {
    id: 104,
    name: "Samsung Odyssey G5 27”",
    brand: "Samsung",
    category: "Monitor",
    resolution: "2K QHD",
    refreshRate: "144Hz",
    price: 7490000,
    quantity: 1,
    warranty: "24 months",
    image: "https://picsum.photos/300/300?random=14",
    checked: false,
  },
]);

  const [appliedPromos, setAppliedPromos] = useState([]);

  /* ===== TOTAL ===== */
  const subtotal = useMemo(() => {
    return cart
      .filter((i) => i.checked)
      .reduce((s, i) => s + i.price * i.quantity, 0);
  }, [cart]);

  const totalDiscount = appliedPromos.reduce((s, p) => s + p.amount, 0);
  const total = Math.max(0, subtotal - totalDiscount);

  /* ===== HANDLERS ===== */
  const applyPromo = (code) => {
    if (appliedPromos.length >= 3) return;
    if (appliedPromos.find((p) => p.code === code)) return;
    if (!VALID_PROMOS[code]) return;

    setAppliedPromos([...appliedPromos, { code, amount: VALID_PROMOS[code] }]);
  };

  const removePromo = (code) => {
    setAppliedPromos(appliedPromos.filter((p) => p.code !== code));
  };

  return (
    <div
      className="
    w-full min-h-screen
    px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24
    py-6
    text-zinc-200
    flex flex-col lg:flex-row
    gap-6 lg:gap-10
    bg-zinc-950
  "
    >
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Sản phẩm trong giỏ ({cart.length})
        </h2>

        <div
          className="
    flex-1
    space-y-4 sm:space-y-6

    max-h-[60vh]
    sm:max-h-[65vh]
    lg:max-h-[calc(100vh-160px)]

    overflow-y-auto
    pr-1 sm:pr-2

    [-ms-overflow-style:none]
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
        >
          {cart.map((item) => (
            <CartItem
              key={`${item.id}-${item.image}`}
              item={item}
              onToggleCheck={() =>
                setCart(
                  cart.map((i) =>
                    i.id === item.id ? { ...i, checked: !i.checked } : i,
                  ),
                )
              }
              onChangeQty={(d) =>
                setCart(
                  cart.map((i) =>
                    i.id === item.id
                      ? { ...i, quantity: Math.max(1, i.quantity + d) }
                      : i,
                  ),
                )
              }
              onRemove={() => setCart(cart.filter((i) => i.id !== item.id))}
            />
          ))}
        </div>
      </div>

      <OrderSummary
        subtotal={subtotal}
        total={total}
        appliedPromos={appliedPromos}
        onApplyPromo={applyPromo}
        onRemovePromo={removePromo}
      />
    </div>
  );
}
