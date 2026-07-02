import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/common/Pagination";
import PromotionCard from "../../components/customer/Promotion/PromotionCard";

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

const PAGE_SIZE = 6;
const DEFAULT_PROMO_TYPE = "all";

export default function PromotionPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [promoType, setPromoType] = useState(DEFAULT_PROMO_TYPE);

  const [promotions, setPromotions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Separate page state like ProductPage
  const [defaultPage, setDefaultPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [filterPage, setFilterPage] = useState(1);

  const activeMode = useMemo(() => {
    const hasSearch = search.trim().length > 0;
    const hasDate = Boolean(dateFrom || dateTo);
    const hasType = promoType !== DEFAULT_PROMO_TYPE;

    if (hasSearch) return "search";
    if (hasDate || hasType) return "filter";
    return "default";
  }, [search, dateFrom, dateTo, promoType]);

  const currentPage =
    activeMode === "search" ? searchPage : activeMode === "filter" ? filterPage : defaultPage;

  const resetFilter = () => {
    setDateFrom("");
    setDateTo("");
    setPromoType(DEFAULT_PROMO_TYPE);
    setFilterPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearch(searchInput);
      setSearchPage(1);
    }
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

  useEffect(() => {
    let isMounted = true;

    async function loadPromotions() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAGE_SIZE),
        });

        if (activeMode === "search") {
          params.set("search", search.trim());
        } else if (activeMode === "filter") {
          if (promoType !== DEFAULT_PROMO_TYPE) {
            params.set("discountType", promoType);
          }
          if (dateFrom) params.set("dateFrom", dateFrom);
          if (dateTo) params.set("dateTo", dateTo);
        }

        const response = await fetch(`${API_BASE_URL}/promotions?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Không thể tải khuyến mãi");
        }

        if (isMounted) {
          setPromotions(data.promotions || []);
          setPagination(data.pagination || { page: currentPage, totalPages: 1, totalItems: 0 });
        }
      } catch (err) {
        if (isMounted) {
          setPromotions([]);
          setPagination({ page: currentPage, totalPages: 1, totalItems: 0 });
          setError(err?.message || "Không thể tải khuyến mãi");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPromotions();

    return () => {
      isMounted = false;
    };
  }, [activeMode, currentPage, search, dateFrom, dateTo, promoType]);

  // Sync: typing then pressing enter uses searchInput; keep header UX consistent with products.
  const handleSearchInputChange = (v) => {
    setSearchInput(v);
    // do not call API on each keystroke
  };

  return (
    <div className="w-full h-full bg-zinc-950 text-zinc-200 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-40">
        <div className="px-4 sm:px-8 py-4 flex gap-3">
          <div className="flex-1 relative">
            <input
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Tìm kiếm khuyến mãi..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-amber-400"
            />
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            className="sm:hidden px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700"
          >
            <i className="fas fa-filter" />
          </button>
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      {filterOpen && (
        <div
          onClick={() => setFilterOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 sm:hidden"
        />
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* SIDEBAR */}
        <aside
          className={`
            w-72 bg-zinc-900 border-r border-zinc-800
            p-6 flex flex-col overflow-y-auto
            fixed sm:sticky top-0
            h-screen sm:h-auto
            z-50 transition-transform duration-300
            ${filterOpen ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
          `}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <i className="fas fa-filter" />
            Bộ lọc
          </h2>

          {/* DATE */}
          <div className="mb-8">
            <h3 className="text-amber-400 font-medium mb-4">KHOẢNG THỜI GIAN</h3>
            <div className="space-y-4 text-sm">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* TYPE */}
          <div className="mb-8">
            <h3 className="text-amber-400 font-medium mb-4">LOẠI KHUYẾN MÃI</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Tất cả", value: DEFAULT_PROMO_TYPE },
                { label: "Giảm %", value: "percent" },
                { label: "Giảm tiền", value: "cash" },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={promoType === item.value}
                    onChange={() => {
                      setPromoType(item.value);
                      setFilterPage(1);
                    }}
                    className="accent-amber-400"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <button onClick={resetFilter} className="w-full text-sm text-zinc-400">
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 min-h-0 flex flex-col space-y-10">
          {loading ? (
            <div className="text-center text-zinc-400 mt-16">Đang tải khuyến mãi...</div>
          ) : error ? (
            <div className="text-center text-red-400 mt-16">{error}</div>
          ) : promotions.length === 0 ? (
            <div className="text-center text-zinc-500 mt-20">Không có khuyến mãi phù hợp</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((item) => (
                <PromotionCard key={item.id} promotion={item} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="mt-auto pt-8">
            <Pagination
              currentPage={pagination.page || currentPage}
              totalPages={pagination.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

