const tags = [
  "Wireless",
  "Bluetooth53",
  "ANC",
  "LowLatency",
  "HiFiSound",
];

export default function Tags() {
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-medium text-gray-300">Tags</h3>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="
              cursor-pointer
              rounded-full
              border border-[#FFCC00]/50
              bg-[#0b0b0b]
              px-5 py-2
              text-sm font-medium
              text-[#FFCC00]
              transition-all duration-300
              hover:scale-105
              hover:border-[#FFCC00]
              hover:bg-[#FFCC00]
              hover:text-black
              hover:shadow-[0_0_18px_rgba(255,204,0,0.6)]
              active:scale-95
            "
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}