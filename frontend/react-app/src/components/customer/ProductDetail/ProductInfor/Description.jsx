export default function Description({ product, selectedVariant }) {
  const productDescription = product?.description;
  const variantDescription = selectedVariant?.description;
  const variantName = [selectedVariant?.color, selectedVariant?.storage]
    .filter(Boolean)
    .join(" / ");

  const shouldShowVariantBlock =
    typeof variantDescription === "string" && variantDescription.trim() !== "";

  return (
    <div className="mt-10 border-t border-gray-800 pt-6">
      <h3 className="mb-3 text-lg font-semibold">Mô tả</h3>

      {productDescription ? (
        <p className="leading-relaxed text-gray-400">{productDescription}</p>
      ) : null}

      {shouldShowVariantBlock && variantDescription !== productDescription ? (
        <div className="mt-6">
          <h4 className="mb-3 text-md font-semibold text-white">
            Mô tả – {variantName || "variant"}
          </h4>
          <p className="leading-relaxed text-gray-400">{variantDescription}</p>
        </div>
      ) : null}
    </div>
  );
}

