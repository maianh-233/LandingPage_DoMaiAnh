import { ShoppingCart, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import {
    incrementAddCount,
    upsertCartItem,
} from "../../../../utils/cartLocalStorage";
import LoginRequiredToast from "../../../common/LoginRequiredToast";

function playTing() {
  // WebAudio beep để không phụ thuộc file audio.
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();

    o1.type = "sine";
    o2.type = "triangle";

    o1.frequency.value = 880; // A5
    o2.frequency.value = 1320; // E6

    g.gain.value = 0.0001;
    o1.connect(g);
    o2.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.2);
    o2.stop(now + 0.2);

    setTimeout(() => {
      ctx.close?.();
    }, 250);
  } catch {
    // ignore
  }
}

export default function ActionButtons({ product, selectedVariant }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [qty, setQty] = useState(1);
  const [showLoginToast, setShowLoginToast] = useState(false);

  const userId = useMemo(() => user?.id || user?.userId || null, [user]);

  const handleAddToCart = () => {
    if (loading) return;
    if (!userId) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 2600);
      return;
    }

    if (!selectedVariant) return;

    const productId = product?.id ?? product?._id ?? null;
    const variantId = selectedVariant?.id ?? null;
    if (!productId || !variantId) return;

    // lưu/sửa item (quantity không kiểm tra tồn kho, giới hạn 1..5)
    upsertCartItem({
      userId,
      productId,
      variantId,
      quantity: qty,
      itemMeta: {
        // để dễ hiển thị ở /carts nếu cần
        name: product?.name,
        brand: product?.brand?.name,
        imageUrl: selectedVariant?.imageUrl,
        color: selectedVariant?.color,
        storage: selectedVariant?.storage,
        price: selectedVariant?.price ?? selectedVariant?.salePrice ?? null,
      },
    });

    // mỗi lần nhấn +1 vào badge
    incrementAddCount(userId, 1);

    playTing();
    navigate("/carts");
  };

  return (
    <div className="mt-10">
      {showLoginToast && <LoginRequiredToast />}

      {/* ===== SỐ LƯỢNG ===== */}
      <div className="mb-8">
        <span className="block mb-3 text-base font-medium text-white">
          Số lượng
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQty((p) => Math.max(1, p - 1))}
            className="
        w-10 h-10 rounded-xl
        bg-zinc-800 hover:bg-zinc-700
        text-zinc-200 text-lg font-semibold
      "
          >
            -
          </button>

          <span className="min-w-10 text-center text-lg font-semibold text-white">
            {qty}
          </span>

          <button
            type="button"
            onClick={() => {
              setQty((p) => {
                if (p >= 5) {
                  alert(
                    "Bạn đã chọn tối đa 5 sản phẩm. Nếu cần mua số lượng lớn, vui lòng liên hệ qua mail.",
                  );
                  return p;
                }
                return p + 1;
              });
            }}
            className="
        w-10 h-10 rounded-xl
        bg-zinc-800 hover:bg-zinc-700
        text-zinc-200 text-lg font-semibold
      "
          >
            +
          </button>
        </div>
      </div>

      {/* ===== 2 NÚT CÙNG 1 DIV ===== */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="
          group flex-1 flex items-center justify-center gap-3
          rounded-3xl bg-[#FFCC00] py-4
          text-lg font-semibold text-black
          transition-all duration-300
          hover:scale-[1.03]
          hover:shadow-[0_0_25px_rgba(255,204,0,0.6)]
          active:scale-95
        "
        >
          <ShoppingCart
            size={22}
            className="transition-transform duration-300 group-hover:rotate-[-10deg]"
          />
          Thêm vào giỏ hàng
        </button>

        {/* Buy now */}
        <button
          className="
          group flex-1 flex items-center justify-center gap-3
          rounded-3xl border-2 border-[#FFCC00] py-4
          text-lg text-white
          transition-all duration-300
          hover:scale-[1.03]
          hover:bg-[#FFCC00]
          hover:text-black
          hover:shadow-[0_0_25px_rgba(255,204,0,0.6)]
          active:scale-95
        "
          onClick={() => {
            // xử lý mua ngay sau
          }}
        >
          <Zap
            size={22}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
          Mua ngay
        </button>
      </div>
    </div>
  );
}
