import { useMemo, useState } from "react";
import BestSellerSection from "../../components/customer/BestSellerSection";
import BrandsSection from "../../components/customer/BrandsSection";
import CategoryGrid from "../../components/customer/CategoryGrid";
import ExpertSection from "../../components/customer/ExpertSection";
import HeroSlider from "../../components/customer/HeroSlider";
import ValuesSection from "../../components/customer/ValuesSection";
import VideoSection from "../../components/customer/VideoSection";
import {
  bestSellerProducts,
  brands,
  categories,
  experts,
  heroSlides,
  values,
} from "../../hooks/storefrontData";
import { useHeroSlider } from "../../hooks/useHeroSlider";

export default function CustomerHome() {
  const [activeCollectionId, setActiveCollectionId] = useState(
    heroSlides[0]?.id ?? null,
  );
  const { currentIndex, next, prev } = useHeroSlider(heroSlides.length);

  const activeCollection = useMemo(
    () => heroSlides.find((slide) => slide.id === activeCollectionId),
    [activeCollectionId],
  );

  return (
    <>
      <HeroSlider
        slides={heroSlides}
        currentIndex={currentIndex}
        onNext={next}
        onPrev={prev}
        onViewCollection={setActiveCollectionId}
      />

      <main className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 2xl:px-16">
        <CategoryGrid categories={categories} />
        <BestSellerSection products={bestSellerProducts} />
        <BrandsSection brands={brands} />
        <VideoSection />
        <ValuesSection values={values} />
        <ExpertSection experts={experts} />

        <section
          className="
  mt-20
  rounded-3xl
  border border-zinc-800
  bg-gradient-to-br from-zinc-900 to-zinc-950
  px-6 py-12
  text-center
"
        >
          <h3 className="mb-2 text-2xl font-semibold text-white">
            Nhận ưu đãi & sản phẩm mới
          </h3>

          <p className="mb-6 text-sm text-zinc-400">
            Đăng ký email để không bỏ lỡ các chương trình khuyến mãi độc quyền
          </p>

          <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="
        flex-1
        rounded-full
        bg-zinc-800
        px-4 py-3
        text-sm text-white
        outline-none
        focus:ring-2 focus:ring-amber-400
      "
            />

            <button
              type="submit"
              className="
        rounded-full
        bg-gradient-to-r from-amber-400 to-orange-500
        px-6 py-3
        text-sm font-semibold
        text-black
        transition
        hover:brightness-110
      "
            >
              Đăng ký
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
