import { useState } from "react";

export default function HeadphoneSelector() {
  const [selected, setSelected] = useState("black");

  const headphones = [
    {
      id: "black",
      name: "Black Edition",
      image:
        "https://i.pinimg.com/1200x/93/16/f2/9316f2e204ba45717b80c41e1ab66e31.jpg",
    },
    {
      id: "white",
      name: "White Edition",
      image:
        "https://i.pinimg.com/736x/f3/c9/96/f3c9960ca48389b120e5b9bbc4dc9471.jpg",
    },
    {
      id: "blue",
      name: "Blue Edition",
      image:
        "https://i.pinimg.com/736x/11/5b/ea/115bea4c439db9e0f54af3e35e1b6aa8.jpg",
    },
    {
      id: "red",
      name: "Red Edition",
      image:
        "https://i.pinimg.com/1200x/4f/d2/07/4fd2075c7782fc6dd8abcc1a3d732bc4.jpg",
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-medium text-gray-300">
        Phiên bản
      </h3>

      <div className="flex gap-4">
        {headphones.map((item) => {
          const active = selected === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`
                group relative flex flex-col items-center
                rounded-2xl p-2
                border-2 transition-all duration-200
                ${
                  active
                    ? "border-[#FFCC00] shadow-[0_0_0_2px_#FFCC00]"
                    : "border-gray-700 hover:border-[#FFCC00] hover:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                }
              `}
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 object-contain transition-transform duration-200 group-hover:scale-105"
              />

              <span
                className={`mt-2 text-xs transition-colors ${
                  active ? "text-[#FFCC00]" : "text-gray-400 group-hover:text-[#FFCC00]"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}