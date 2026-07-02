import { useEffect, useState } from "react";
import { getCartAddCount } from "../utils/cartLocalStorage";

export default function useCartCount(user) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const userId = user?.id ?? user?.userId;

    const update = () => {
      if (!userId) {
        setCount(0);
        return;
      }
      setCount(getCartAddCount(userId));
    };

    update();

    // cập nhật khi tab khác thay đổi localStorage
    const handler = (e) => {
      if (e.key === "lunaria_cart_by_user") update();
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [user]);

  return count;
}

