import { useCallback, useEffect, useMemo, useState } from "react";
import CartItemLite from "../../components/customer/CartComponent/CartItemLite";
import OrderSummary from "../../components/customer/CartComponent/OrderSummary";

import { useAuth } from "../../context/AuthContext";
import { getUserCart, setUserCart } from "../../utils/cartLocalStorage";

const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    const normalizedUrl = envUrl.replace(/\/$/, "");
    return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
  }

  if (import.meta.env.PROD) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/api`;
  }

  return "http://localhost:5000/api";
})();
export default function CartPage() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId;

  const normalizeItems = useCallback(
    (items) =>
      (Array.isArray(items) ? items : []).map((item) => ({
        ...item,
        checked: item.checked !== false,
      })),
    [],
  );

  const [cartItems, setCartItems] = useState(() => {
    if (!userId) return [];
    const cart = getUserCart(userId);
    return normalizeItems(cart?.items);
  });

  const [appliedPromos, setAppliedPromos] = useState([]);

  const sync = useCallback(
    (nextItems) => {
      const normalized = normalizeItems(nextItems);
      setCartItems(normalized);
      if (!userId) return;
      setUserCart(userId, { userId, items: normalized });
    },
    [userId, normalizeItems],
  );

  const checkedItems = useMemo(
    () => cartItems.filter((item) => item.checked !== false),
    [cartItems],
  );

  const subtotal = useMemo(() => {
    return checkedItems.reduce(
      (s, i) => s + Number(i.price || 0) * Number(i.quantity || 1),
      0,
    );
  }, [checkedItems]);

  const totalDiscount = appliedPromos.reduce((s, p) => s + p.amount, 0);
  const total = Math.max(0, subtotal - totalDiscount);

  const applyPromo = async (code) => {
    if (appliedPromos.length >= 3) {
      return { ok: false, message: "Tối đa 3 mã giảm giá" };
    }
    if (appliedPromos.find((p) => p.code === code)) {
      return { ok: false, message: "Mã đã được áp dụng" };
    }
    if (subtotal <= 0) {
      return { ok: false, message: "Vui lòng chọn sản phẩm để áp dụng mã" };
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/promotions/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await resp.json();

      if (!data?.ok || !data?.promotion) {
        return { ok: false, message: data?.message || "Khuyến mãi không hợp lệ" };
      }

      setAppliedPromos((prev) => [
        ...prev,
        {
          code: data.promotion.code,
          name: data.promotion.name,
          amount: Number(data.promotion.discountAmount),
        },
      ]);

      return { ok: true };
    } catch (e) {
      console.error("applyPromo failed", e);
      return { ok: false, message: "Không thể kết nối máy chủ" };
    }
  };


  const removePromo = (code) => {
    setAppliedPromos(appliedPromos.filter((p) => p.code !== code));
  };

  useEffect(() => {
    if (subtotal <= 0 && appliedPromos.length > 0) {
      setAppliedPromos([]);
    }
  }, [subtotal, appliedPromos.length]);

  // Persist sang checkout (chỉ sản phẩm đã chọn)
  useEffect(() => {
    try {
      localStorage.setItem(
        "appliedPromos",
        JSON.stringify({
          items: checkedItems,
          appliedPromos,
        })
      );
    } catch {
      // ignore
    }

  }, [checkedItems, appliedPromos]);



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
          Sản phẩm trong giỏ ({cartItems.length})
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
          {cartItems.length === 0 ? (
            <div className="text-zinc-400 py-8 text-center">
              Chưa có sản phẩm nào trong giỏ.
            </div>
          ) : (
            cartItems.map((item, idx) => {
              const key = `${item.productId ?? ""}-${item.variantId ?? ""}-${idx}`;
              return (
                <CartItemLite
                  key={key}
                  item={item}
                  onToggleCheck={() => {
                    const next = cartItems.map((it, i) =>
                      i === idx ? { ...it, checked: !(it.checked !== false) } : it,
                    );
                    sync(next);
                  }}
                  onChangeQty={(d) => {
                    const next = cartItems.map((it, i) => {
                      if (i !== idx) return it;
                      const nextQty = Math.min(5, Math.max(1, Number(it.quantity || 1) + d));
                      return { ...it, quantity: nextQty };
                    });
                    sync(next);
                  }}
                  onRemove={() => {
                    const next = cartItems.filter((_, i) => i !== idx);
                    sync(next);
                  }}
                />
              );
            })
          )}
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

