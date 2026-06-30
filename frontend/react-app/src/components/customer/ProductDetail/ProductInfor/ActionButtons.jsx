import { ShoppingCart, Zap } from "lucide-react";

export default function ActionButtons() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      
      {/* Add to cart */}
      <button
        onClick={() => alert("✅ Đã thêm vào giỏ hàng!")}
        className="
          group flex flex-1 items-center justify-center gap-3
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
          group flex flex-1 items-center justify-center gap-3
          rounded-3xl border-2 border-[#FFCC00] py-4
          text-lg text-white
          transition-all duration-300
          hover:scale-[1.03]
          hover:bg-[#FFCC00]
          hover:text-black
          hover:shadow-[0_0_25px_rgba(255,204,0,0.6)]
          active:scale-95
        "
      >
        <Zap
          size={22}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
        Mua ngay
      </button>

    </div>
  );
}