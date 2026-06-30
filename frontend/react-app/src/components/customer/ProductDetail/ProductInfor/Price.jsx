export default function Price() {
  return (
    <div
      className="
        mt-6
        flex
        flex-wrap
        items-center
        gap-x-4
        gap-y-2
      "
    >
      {/* Giá hiện tại */}
      <span
        className="
          text-3xl
          font-bold
          text-[#FFCC00]
          sm:text-4xl
        "
      >
        450,000 ₫
      </span>

      {/* Giá cũ */}
      <span
        className="
          text-lg
          text-gray-500
          line-through
          sm:text-2xl
        "
      >
        650,000 ₫
      </span>

      {/* Giảm giá */}
      <span
        className="
          rounded-full
          bg-[#FFCC00]/20
          px-3 py-1
          text-xs
          font-medium
          text-[#FFCC00]
          sm:px-4 sm:py-1.5 sm:text-sm
        "
      >
        -31%
      </span>
    </div>
  );
}