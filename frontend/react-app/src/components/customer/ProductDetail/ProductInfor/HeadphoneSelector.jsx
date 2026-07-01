import { useMemo, useState } from "react";

export default function HeadphoneSelector({ variants = [], onSelectVariant }) {
  // NOTE: selection theo variants thật từ backend
  const initialVariantId = useMemo(() => variants?.[0]?.id || "", [variants]);
  const [selectedVariantId, setSelectedVariantId] = useState(initialVariantId);

  const effectiveSelectedVariantId =
    selectedVariantId || variants?.[0]?.id || "";






  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-medium text-gray-300">Phiên bản</h3>

      {/* NOTE: nút chọn lấy từ variants trả về từ backend */}
      <div className="flex gap-4">
        {(variants || []).map((item) => {
          const active = effectiveSelectedVariantId === item.id;
          const label = [item.color, item.storage].filter(Boolean).join(" / ");

          return (
            <button
              key={item.id}
              type="button"
                onClick={() => {
                  // NOTE: chỉ update UI theo selection hiện tại
                  setSelectedVariantId(item.id);

                  // NOTE: notify lên ProductInfo để đổi giá/ảnh (nếu component cha nhận)
                  if (typeof onSelectVariant === "function") {
                    onSelectVariant(item);
                  }
                }}
              className={`
                group relative flex flex-col items-center
                rounded-2xl p-2
                border-2 transition-all duration-200
                ${
                  active
                    ? "border-[#FFCC00] shadow-[0_0_0_2px_#FFCC00]"
                    : "border-gray-700 hover:border-[#FFCC00] hover:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                }
              `}
            >
              <img
                src={item.imageUrl || "https://i.pinimg.com/1200x/93/16/f2/9316f2e204ba45717b80c41e1ab66e31.jpg"}
                alt={label || "Variant"}
                className="h-20 w-20 object-contain transition-transform duration-200 group-hover:scale-105"
              />

              <span
                className={`mt-2 text-xs transition-colors ${
                  active ? "text-[#FFCC00]" : "text-gray-400 group-hover:text-[#FFCC00]"
                }`}
              >
                {label || "Phiên bản"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}