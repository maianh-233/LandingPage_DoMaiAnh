import SearchBar from "./SearchBar";

export default function ProductHeader({
  search,
  setSearch,
  onSearchKeyDown,
  setOpenFilter,
}) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="px-4 py-3 sm:px-6 sm:py-4 lg:p-6">
        
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* Search */}
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onKeyDown={onSearchKeyDown} 
              placeholder="Tìm kiếm sản phẩm..."
            />
          </div>


          {/* BUTTON FILTER MOBILE */}
          <button
            className="lg:hidden px-4 py-2 bg-amber-400 rounded-xl"
            onClick={() => setOpenFilter(true)}  
          >
            Bộ lọc
          </button>

        </div>

      </div>
    </header>
  );
}