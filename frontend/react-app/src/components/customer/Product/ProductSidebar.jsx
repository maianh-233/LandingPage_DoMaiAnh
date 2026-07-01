import CategoryFilter from "./CategoryFilter";
import PriceRangeSlider from "./PriceRangeSlider";

export default function ProductSidebar({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  priceRange,
  setPriceRange,
  onApplyFilters,
  onClearFilters,
}) {
  return (
    <div className="p-4 w-full text-sm">
      <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>

      <CategoryFilter
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onToggleCategory={onToggleCategory}
      />

      <PriceRangeSlider
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <button
        onClick={onApplyFilters}
        className="
          w-full
          bg-amber-400 text-black
          py-2 rounded-xl mt-4
          border border-transparent
          transition
          hover:bg-black
          hover:text-amber-400
          hover:border-amber-400
        "
      >
        Áp dụng
      </button>

      <button
        onClick={onClearFilters}
        className="w-full bg-black text-amber-400 border border-amber-400 py-2 rounded-xl mt-2 hover:bg-amber-400 hover:text-black transition"
      >
        Xóa lọc
      </button>
    </div>
  );
}