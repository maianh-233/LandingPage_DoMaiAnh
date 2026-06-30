import { useState } from "react";

export default function CategoryFilter() {
  const [selected, setSelected] = useState({
    devices: false,
    headphones: false,
    keyboards: false,
    mice: false,
    accessories: false,
  });

  const toggle = (key) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mb-8">
      <h3 className="text-amber-400 font-medium mb-3">Danh mục</h3>

      <div className="space-y-2 text-sm">
        {/* Parent */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.devices}
            onChange={() => toggle("devices")}
            className="accent-amber-400"
          />
          Thiết bị công nghệ
        </label>

        {/* Children */}
        <div className="pl-6 space-y-2 border-l border-zinc-700 ml-2">
          {[
            { key: "headphones", label: "Tai nghe" },
            { key: "keyboards", label: "Bàn phím" },
            { key: "mice", label: "Chuột" },
            { key: "accessories", label: "Phụ kiện" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected[item.key]}
                onChange={() => toggle(item.key)}
                className="accent-amber-400"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}