function resolveActiveMode({ search, selectedCategoryIds, priceRange, defaultPriceRange }) {
  const hasSearch = typeof search === "string" && search.trim().length > 0;
  const hasCategorySelection = Array.isArray(selectedCategoryIds) && selectedCategoryIds.length > 0;
  const hasPriceFilter = Array.isArray(priceRange) && priceRange.length === 2 && (
    priceRange[0] !== defaultPriceRange?.[0] || priceRange[1] !== defaultPriceRange?.[1]
  );

  if (hasSearch) {
    return "search";
  }

  if (hasCategorySelection || hasPriceFilter) {
    return "filter";
  }

  return "default";
}

function getPaginationInfo({ page, limit, totalItems }) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 8);
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safeLimit));

  return {
    page: safePage,
    limit: safeLimit,
    totalItems: safeTotalItems,
    totalPages,
  };
}

module.exports = {
  resolveActiveMode,
  getPaginationInfo,
};
