import { Heart } from "lucide-react";
import { useState } from "react";

export default function Breadcrumb() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      
      {/* Breadcrumb */}
      <nav className="overflow-x-auto whitespace-nowrap text-sm text-gray-400">
        Công nghệ / Âm thanh /{" "}
        <span className="text-white">Tai nghe Wireless Pro</span>
      </nav>

      {/* Favorite button */}
      <button
        onClick={() => setLiked(!liked)}
        className={`
          group flex h-11 w-11 items-center justify-center
          rounded-full border
          transition-all duration-300
          hover:scale-110
          active:scale-95
          ${
            liked
              ? "border-red-500 bg-red-500/10 shadow-[0_0_18px_rgba(239,68,68,0.6)]"
              : "border-white/40 hover:border-red-400"
          }
        `}
        aria-label="Thêm vào yêu thích"
      >
        <Heart
          size={22}
          className={`
            transition-all duration-300
            ${
              liked
                ? "fill-red-500 text-red-500 scale-110"
                : "fill-white text-white group-hover:text-red-400 group-hover:fill-red-400"
            }
          `}
        />
      </button>
    </div>
  );
}