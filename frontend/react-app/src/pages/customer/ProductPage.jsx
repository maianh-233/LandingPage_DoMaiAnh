import { useEffect, useMemo, useState } from "react";
import ProductHeader from "../../components/customer/Product/ProductHeader";
import ProductLayout from "../../components/customer/Product/ProductLayout";
import ProductSidebar from "../../components/customer/Product/ProductSidebar";

import ProductGrid from "../../components/customer/Product/ProductGrid";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";


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

  // Infinite scroll on mobile only (sm and below)
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  }, []);

  const hasMore = useMemo(() => {
    const totalPages = pagination?.totalPages || 1;
    return currentPage < totalPages;
  }, [pagination?.totalPages, currentPage]);


  const handleLoadMore = async () => {
    if (!hasMore) return;
    const nextPage = currentPage + 1;

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
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

      const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Không thể tải sản phẩm");

      setProducts((prev) => [...prev, ...(data.products || [])]);
      setPagination(
        data.pagination || {
          page: nextPage,
          totalPages: pagination.totalPages || 1,
          totalItems: pagination.totalItems || 0,
        }
      );

      // advance page state for subsequent fetches
      if (activeMode === "search") setSearchPage(nextPage);
      else if (activeMode === "filter") setFilterPage(nextPage);
      else setDefaultPage(nextPage);
    } catch (e) {
      // ignore; keep current list
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const { sentinelRef } = useInfiniteScroll({

    hasMore: isMobile && hasMore,
    loading: loading,
    onLoadMore: handleLoadMore,
    root: null,
    rootMargin: "300px",
    threshold: 0,
  });

  
  return (
  <>
    {loading && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-12 h-12 animate-spin">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-white/40 to-transparent" />
            <div className="absolute inset-[3px] rounded-full bg-black" />
          </div>

          {/* Text */}
          <span className="text-white/80 text-sm tracking-wide">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    )}

    <div className="contents">
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
          error={error}
        />
      }
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
    />

      {/* Sentinel for infinite scroll (mobile only) */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  </>
);

}