export default function ExtraInfo({ product, selectedVariant }) {
  const specs = product?.specs || [];

  const selectedStorage = selectedVariant?.storage;

  // Cố gắng lọc nếu spec có storage (trường hợp backend có).
  const filteredSpecs = Array.isArray(specs)
    ? specs.filter((s) => {
        if (!selectedStorage) return true;
        if (s?.storage) return s.storage === selectedStorage;
        return true;
      })
    : [];

  if (!filteredSpecs.length && !selectedStorage) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      {selectedStorage ? (
        <div>
          <strong className="text-gray-300">Storage:</strong>{" "}
          <span className="text-gray-400">{selectedStorage}</span>
        </div>
      ) : null}

      {filteredSpecs.map((spec) => (
        <div key={spec?.id || spec?.key}>
          <strong className="text-gray-300">{spec?.key}:</strong>{" "}
          <span className="text-gray-400">{spec?.value}</span>
        </div>
      ))}
    </div>
  );
}


