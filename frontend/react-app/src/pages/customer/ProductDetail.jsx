import Breadcrumb from "../../components/customer/ProductDetail/Breadcrumb";
import ProductGallery from "../../components/customer/ProductDetail/ProductGallery";
import ProductInfo from "../../components/customer/ProductDetail/ProductInfor/ProductInfo";
import Reviews from "../../components/customer/ProductDetail/Review/Reviews";
import SuggestedProducts from "../../components/customer/ProductDetail/SuggestedProducts";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { productId } = useParams();

  const API_BASE_URL = useMemo(() => {
    // NOTE: đồng bộ với ProductPage - lấy API base url từ env
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
  }, []);


  const [productDetail, setProductDetail] = useState(null);
  const [variants, setVariants] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // NOTE: fetch product detail + variants
        const detailRes = await fetch(`${API_BASE_URL}/products/${productId}`);
        const detailData = await detailRes.json();
        if (!detailRes.ok) throw new Error(detailData?.message || "Không thể tải chi tiết sản phẩm");

        // NOTE: fetch gợi ý (lấy đại 5 sản phẩm)
        const suggestRes = await fetch(`${API_BASE_URL}/products/${productId}/suggestions`);
        const suggestData = await suggestRes.json();
        if (!suggestRes.ok) throw new Error(suggestData?.message || "Không thể tải sản phẩm gợi ý");

        if (!ignore) {
          setProductDetail(detailData?.product || detailData);
          setVariants(detailData?.variants || []);
          setSuggestions(suggestData?.suggestions || suggestData || []);
        }
      } catch (e) {
        if (!ignore) setError(e.message || "Có lỗi xảy ra");
      } finally {
        if (!ignore) setLoading(false);
      }

    }

    if (productId) load();

    return () => {
      ignore = true;
    };
  }, [API_BASE_URL, productId]);

  return (
    <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
      

      {/* NOTE: loading/error cho trang chi tiết */}
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

      {!loading && error && (
        <div className="py-10 text-red-400">{error}</div>
      )}

      {!loading && !error && (
        <>
          <Breadcrumb />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* NOTE: đổ variants thật vào gallery */}
            <ProductGallery variants={variants} />

            {/* NOTE: đổ product + variants thật vào info */}
            <ProductInfo product={productDetail} variants={variants} />
          </div>

          {/* SUGGESTED PRODUCTS */}
          <section className="mt-20 border-t border-zinc-800 pt-14">
            {/* NOTE: hiển thị 5 sản phẩm gợi ý lấy từ backend */}
            <SuggestedProducts products={suggestions} />
          </section>
          
          {/* REVIEWS (giữ mock giả như hiện tại theo yêu cầu) */}
          <section className="mt-20 border-t border-zinc-800 pt-14">
            <Reviews />
          </section>
        </>
      )}


    </div>
  );
}
