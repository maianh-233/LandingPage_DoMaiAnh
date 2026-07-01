import { useEffect, useState } from "react";
import ProductGrid from "../../components/customer/Product/ProductGrid";
import ProductHeader from "../../components/customer/Product/ProductHeader";
import ProductLayout from "../../components/customer/Product/ProductLayout";
import ProductSidebar from "../../components/customer/Product/ProductSidebar";

const DEFAULT_PRICE_RANGE = [100000, 2000000];
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) {
    const normalizedUrl = envUrl.replace(/\/$/, "");
    return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
  }

  if (import.meta.env.PROD) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/api`;
  }

  return "http://localhost:5000/api";
})();

export default function ProductPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("product");
  const [openFilter, setOpenFilter] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [defaultPage, setDefaultPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [filterPage, setFilterPage] = useState(1);

  const [draftCategoryIds, setDraftCategoryIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [draftPriceRange, setDraftPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [appliedPriceRange, setAppliedPriceRange] = useState(DEFAULT_PRICE_RANGE);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  const activeMode = search.trim().length > 0 ? "search" : (selectedCategoryIds.length > 0 || appliedPriceRange[0] !== DEFAULT_PRICE_RANGE[0] || appliedPriceRange[1] !== DEFAULT_PRICE_RANGE[1] ? "filter" : "default");
  const currentPage = activeMode === "search" ? searchPage : activeMode === "filter" ? filterPage : defaultPage;

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearch(searchInput); // lúc này mới tìm
      setSearchPage(1);
    }
  };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: "8",
        });

        if (activeMode === "search") {
          params.set("search", search.trim());
        } else if (activeMode === "filter") {
          params.set("minPrice", String(appliedPriceRange[0]));
          params.set("maxPrice", String(appliedPriceRange[1]));
          if (selectedCategoryIds.length > 0) {
            params.set("categoryIds", selectedCategoryIds.join(","));
          }
        }

        const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Không thể tải sản phẩm");
        }

        setProducts(data.products || []);
        setPagination(data.pagination || { page: currentPage, totalPages: 1, totalItems: 0 });
      } catch (err) {
        setProducts([]);
        setPagination({ page: currentPage, totalPages: 1, totalItems: 0 });
        setError(err.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [activeMode, search, searchPage, defaultPage, filterPage, selectedCategoryIds, appliedPriceRange, currentPage]);



  const handleToggleCategory = (categoryId) => {
    setDraftCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleApplyFilters = () => {
    setSelectedCategoryIds(draftCategoryIds);
    setAppliedPriceRange(draftPriceRange);
    setFilterPage(1);
  };

  const handleClearFilters = () => {
    setDraftCategoryIds([]);
    setSelectedCategoryIds([]);
    setDraftPriceRange(DEFAULT_PRICE_RANGE);
    setAppliedPriceRange(DEFAULT_PRICE_RANGE);
    setFilterPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (activeMode === "search") {
      setSearchPage(nextPage);
      return;
    }

    if (activeMode === "filter") {
      setFilterPage(nextPage);
      return;
    }

    setDefaultPage(nextPage);
  };

  return (
    <ProductLayout
      header={
        <ProductHeader
          search={searchInput}          
          setSearch={setSearchInput}    
          onSearchKeyDown={handleSearchKeyDown} 
          searchType={searchType}
          setSearchType={setSearchType}
          setOpenFilter={setOpenFilter}
        />
      }
      sidebar={
        <ProductSidebar
          categories={categories}
          selectedCategoryIds={draftCategoryIds}
          onToggleCategory={handleToggleCategory}
          priceRange={draftPriceRange}
          setPriceRange={setDraftPriceRange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
      }
      content={
        <ProductGrid
          products={products}
          page={activeMode === "search" ? searchPage : activeMode === "filter" ? filterPage : defaultPage}
          setPage={handlePageChange}
          totalPages={pagination.totalPages || 1}
          loading={loading}
          error={error}
        />
      }
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
    />
  );
}