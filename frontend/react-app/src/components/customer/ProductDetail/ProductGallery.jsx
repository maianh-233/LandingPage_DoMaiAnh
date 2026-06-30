import { useEffect, useState, useRef } from "react";

const images = [
  "https://i.pinimg.com/1200x/93/16/f2/9316f2e204ba45717b80c41e1ab66e31.jpg",
  "https://i.pinimg.com/736x/f3/c9/96/f3c9960ca48389b120e5b9bbc4dc9471.jpg",
  "https://i.pinimg.com/736x/11/5b/ea/115bea4c439db9e0f54af3e35e1b6aa8.jpg",
  "https://i.pinimg.com/1200x/4f/d2/07/4fd2075c7782fc6dd8abcc1a3d732bc4.jpg",
];

export default function ProductGallery() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 giây đổi ảnh
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  return (
    <div>
      {/* MAIN IMAGE */}
      <div
        className="bg-gray-900 rounded-3xl overflow-hidden"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <img
          src={images[index]}
          alt="Product"
          className="w-full aspect-square object-cover transition-opacity duration-500"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            onClick={() => setIndex(i)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover cursor-pointer 
              border-2 flex-shrink-0 transition-all duration-200
              ${
                index === i
                  ? "border-[#FFCC00] shadow-[0_0_0_2px_#FFCC00]"
                  : "border-gray-700 hover:border-[#FFCC00] hover:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
              }`}
          />
        ))}
      </div>
    </div>
  );
}