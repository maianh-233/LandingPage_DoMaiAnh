function formatVnd(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("vi-VN");
}

export default function Price({ selectedVariant }) {
  const price =
    selectedVariant?.price ??
    selectedVariant?.salePrice ??
    selectedVariant?.unitPrice ??
    selectedVariant?.minPrice ??
    null;

  const oldPrice =
    selectedVariant?.oldPrice ??
    selectedVariant?.compareAtPrice ??
    selectedVariant?.listPrice ??
    null;

  const discountPercent = (() => {
    if (!price || !oldPrice) return null;
    const p = Number(price);
    const o = Number(oldPrice);
    if (!p || !o || o <= p) return null;
    return Math.round(((o - p) / o) * 100);
  })();

  const priceText = price ? `${formatVnd(price)} ₫` : "";
  const oldPriceText = oldPrice ? `${formatVnd(oldPrice)} ₫` : "";

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
      <span
        className="
          text-3xl
          font-bold
          text-[#FFCC00]
          sm:text-4xl
        "
      >
        {priceText || "— ₫"}
      </span>

      {oldPriceText ? (
        <span
          className="
            text-lg
            text-gray-500
            line-through
            sm:text-2xl
          "
        >
          {oldPriceText}
        </span>
      ) : null}

      {typeof discountPercent === "number" ? (
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
          -{discountPercent}%
        </span>
      ) : null}
    </div>
  );
}

