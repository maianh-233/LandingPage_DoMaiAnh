import ProductCard from "../Product/ProductCard";

export default function SuggestedProducts({ products = [] }) {
  // NOTE: render từ backend (lấy đại 5 sản phẩm)
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Sản phẩm gợi ý</h2>

        <a
          href="/products"
          className="text-sm font-medium text-amber-400 hover:underline"
        >
          Tìm hiểu thêm →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {(products || []).slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

