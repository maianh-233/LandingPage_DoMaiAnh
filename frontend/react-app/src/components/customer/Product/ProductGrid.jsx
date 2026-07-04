import Pagination from "../../common/Pagination";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, page, setPage, totalPages, error }) {
  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-300">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
