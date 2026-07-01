export default function CategoryFilter({ categories, selectedCategoryIds, onToggleCategory }) {
  if (!categories?.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-amber-400 font-medium mb-3">Danh mục</h3>

      <div className="space-y-2 text-sm">
        {categories.map((category) => {
          const checked = selectedCategoryIds.includes(category.id);

          return (
            <label key={category.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleCategory(category.id)}
                className="accent-amber-400"
              />
              {category.name}
            </label>
          );
        })}
      </div>
    </div>
  );
}