import { useMemo, useState } from "react";

import ActionButtons from "./ActionButtons";
import Description from "./Description";
import ExtraInfo from "./ExtraInfo";
import ColorSelector from "./HeadphoneSelector";
import Price from "./Price";
import Tags from "./Tags";

export default function ProductInfo({ product, variants = [] }) {
  const defaultVariant = useMemo(() => variants?.[0] || null, [variants]);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  // Khi product/variants đổi (render lại), React sẽ mount lại component ở route mới.
  // Vì vậy không cần sync state bằng useEffect để tránh cảnh báo.

  return (
    <div>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={product?.brand?.avatarUrl || product?.brandImage || "https://i.pinimg.com/736x/e6/fd/cc/e6fdccc7d859460f81401b2927a62f50.jpg"}
          className="w-8 h-8 rounded-full"
          alt={product?.brand?.name || "Brand"}
        />
        <a className="text-xl font-semibold hover:text-[#FFCC00]">{product?.brand?.name || "Brand"}</a>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white">
        {product?.name || ""}
      </h1>

      {/* Giá thay theo variant */}
      <Price selectedVariant={selectedVariant || defaultVariant} />

      <ColorSelector
        variants={variants}
        onSelectVariant={(variant) => setSelectedVariant(variant)}
      />

      <ActionButtons />
      <Description product={product} selectedVariant={selectedVariant || defaultVariant} />
      <ExtraInfo product={product} selectedVariant={selectedVariant || defaultVariant} />


      {/* Tags/specs hiện đang dùng mock trong component Tags.jsx.
          Nếu backend đã trả tags/specs thật thì cần cập nhật Tags.jsx/Specs component để render theo props. */}
      <Tags tags={product?.tags || []} />
    </div>
  );
}



