import { useMemo, useState } from "react";

export default function ProductGallery({ variants = [] }) {
  // NOTE: Dữ liệu ảnh lấy từ variants (ảnh theo variant)
  const images = useMemo(() => {
    const imgs = (variants || [])
      .map((v) => v?.imageUrl)
      .filter(Boolean);

    // fallback: nếu chưa có variants thì giữ UI không crash
    return imgs.length
      ? imgs
      : [
          "https://i.pinimg.com/1200x/93/16/f2/9316f2e204ba45717b80c41e1ab66e31.jpg",
        ];
  }, [variants]);

  const [index, setIndex] = useState(0);

  // NOTE: đảm bảo index không vượt quá danh sách ảnh khi variants thay đổi
  const safeIndex = Math.min(index, Math.max(0, images.length - 1));





  return (
    <div>
      {/* MAIN IMAGE */}
      <div
        className="bg-gray-900 rounded-3xl overflow-hidden"
      >
        <img
          src={images[safeIndex]}
          alt="Product"
          className="w-full aspect-square object-cover transition-opacity duration-500"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setIndex(i)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover cursor-pointer 
              border-2 flex-shrink-0 transition-all duration-200
              ${
                index === i
                  ? "border-[#FFCC00] shadow-[0_0_0_2px_#FFCC00]"
                  : "border-gray-700 hover:border-[#FFCC00] hover:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
              }`}
          />
        ))}
      </div>
    </div>
  );
}