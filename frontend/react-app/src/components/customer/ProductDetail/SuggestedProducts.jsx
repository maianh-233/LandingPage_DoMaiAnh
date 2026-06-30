import ProductCard from "../Product/ProductCard";

const mockProducts = [
  {
    id: 1,
    name: "Tai nghe Gaming X1",
    tags: ["New", "Gaming"],
    thumbnail: "https://i.pinimg.com/1200x/72/72/83/727283aa48ebb04b81c5f2d0da02447e.jpg",
    min_price: 1290000,
  },
  {
    id: 2,
    name: "Wireless Bass Pro",
    tags: ["Bass"],
    thumbnail: "https://i.pinimg.com/1200x/72/72/83/727283aa48ebb04b81c5f2d0da02447e.jpg",
    min_price: 1590000,
  },
  {
    id: 3,
    name: "Studio Monitor Z",
    tags: ["Studio"],
    thumbnail: "https://i.pinimg.com/1200x/72/72/83/727283aa48ebb04b81c5f2d0da02447e.jpg",
    min_price: 2290000,
  },
  {
    id: 4,
    name: "Headphone Lite",
    tags: ["Lite"],
    thumbnail: "https://i.pinimg.com/1200x/72/72/83/727283aa48ebb04b81c5f2d0da02447e.jpg",
    min_price: 890000,
  },
  {
    id: 5,
    name: "Noise Cancel Pro",
    tags: ["ANC"],
    thumbnail: "https://i.pinimg.com/1200x/72/72/83/727283aa48ebb04b81c5f2d0da02447e.jpg",
    min_price: 3190000,
  },
];

export default function SuggestedProducts() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Sản phẩm gợi ý
        </h2>

        <a
          href="/products"
          className="text-sm font-medium text-amber-400 hover:underline"
        >
          Tìm hiểu thêm →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}