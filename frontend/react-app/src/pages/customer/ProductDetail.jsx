import Breadcrumb from "../../components/customer/ProductDetail/Breadcrumb";
import ProductGallery from "../../components/customer/ProductDetail/ProductGallery";
import ProductInfo from "../../components/customer/ProductDetail/ProductInfor/ProductInfo";
import SuggestedProducts from "../../components/customer/ProductDetail/SuggestedProducts";
import Reviews from "../../components/customer/ProductDetail/Review/Reviews";

export default function ProductDetail() {
  return (
    <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
      <Breadcrumb />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery />
        <ProductInfo />
      </div>
            {/* SUGGESTED PRODUCTS */}
      <section className="mt-20 border-t border-zinc-800 pt-14">
        <SuggestedProducts />
      </section>

      {/* REVIEWS */}
      <section className="mt-20 border-t border-zinc-800 pt-14">
        <Reviews />
      </section>
    </div>
  );
}