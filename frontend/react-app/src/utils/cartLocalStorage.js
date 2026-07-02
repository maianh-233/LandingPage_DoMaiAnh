const CART_KEY = "lunaria_cart_by_user";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function getCartState() {
  const raw = localStorage.getItem(CART_KEY);
  const parsed = safeParse(raw, {});
  return parsed && typeof parsed === "object" ? parsed : {};
}


export function getUserCart(userId) {
  if (!userId) return null;
  const state = getCartState();
  return state[String(userId)] || { userId, items: [] };
}

export function setUserCart(userId, cart) {
  if (!userId) return;
  const state = getCartState();
  state[String(userId)] = cart;
  localStorage.setItem(CART_KEY, JSON.stringify(state));
}

// items: [{ productId, variantId, quantity, ...rest }]
export function upsertCartItem({ userId, productId, variantId, quantity, itemMeta }) {
  const cart = getUserCart(userId) || { userId, items: [] };
  const items = Array.isArray(cart.items) ? cart.items : [];

  const idx = items.findIndex((i) =>
    String(i.productId) === String(productId) && String(i.variantId) === String(variantId)
  );

  let nextItems;
  if (idx >= 0) {
    nextItems = items.map((i, iIndex) =>
      iIndex === idx
        ? {
            ...i,
            quantity: Math.min(5, Math.max(1, Number(i.quantity) + Number(quantity))),
            ...(itemMeta || {}),
          }
        : i,
    );
  } else {
    nextItems = [
      ...items,
      {
        productId,
        variantId,
        quantity: Math.min(5, Math.max(1, Number(quantity))),
        checked: true,
        ...(itemMeta || {}),
      },
    ];
  }

  const nextCart = { userId, items: nextItems };
  setUserCart(userId, nextCart);
  return nextCart;
}

// count theo "tổng số lần thêm" => mỗi lần thêm sẽ +1 (không theo quantity)
export function getCartAddCount(userId) {
  if (!userId) return 0;
  const state = getCartState();

  // Nếu localStorage bị null/không đúng format => state có thể không phải object
  if (!state || typeof state !== "object") return 0;

  const cart = state[String(userId)];
  if (!cart?.items?.length) return 0;

  // Theo spec: +1 mỗi lần thêm, nhưng không có trường "addCount".
  // Giải pháp lưu tạm số lần thêm vào trường addCount trong cart.
  return Number(cart.addCount) || 0;
}


export function incrementAddCount(userId, delta = 1) {
  if (!userId) return;
  const cart = getUserCart(userId) || { userId, items: [] };
  const current = Number(cart.addCount) || 0;
  const nextCart = { ...cart, addCount: current + delta };
  setUserCart(userId, nextCart);
  return nextCart;
}

