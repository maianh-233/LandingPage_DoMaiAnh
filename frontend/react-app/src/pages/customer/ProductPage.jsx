import { useState } from "react";
import ProductGrid from "../../components/customer/Product/ProductGrid";
import ProductHeader from "../../components/customer/Product/ProductHeader";
import ProductLayout from "../../components/customer/Product/ProductLayout";
import ProductSidebar from "../../components/customer/Product/ProductSidebar";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("product");
  const [priceRange, setPriceRange] = useState([100000, 2000000]);

  const [openFilter, setOpenFilter] = useState(false);

  const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Tai nghe #${i + 1}`,
    tags: i % 2 === 0 ? ["NEW"] : [],
    thumbnail:
      "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg",
    min_price: 299000,
  }));

  return (
    <ProductLayout
      header={
        <ProductHeader
          search={search}
          setSearch={setSearch}
          searchType={searchType}
          setSearchType={setSearchType}
          setOpenFilter={setOpenFilter}  
        />
      }
      sidebar={
        <ProductSidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      }
      content={
        <ProductGrid
          products={mockProducts}
          page={page}
          setPage={setPage}
        />
      }
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
    />
  );
}