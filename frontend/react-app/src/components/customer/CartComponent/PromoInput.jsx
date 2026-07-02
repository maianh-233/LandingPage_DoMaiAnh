import { useState } from "react";

export default function PromoInput({ onApply, disabled }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Vui lòng nhập mã");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await onApply?.(normalized);

      if (result === false || result?.ok === false) {
        setError(result?.message || "Khuyến mãi không hợp lệ");
        return;
      }

      setCode("");
    } catch {
      setError("Không thể áp dụng mã. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Mã giảm giá"
          disabled={disabled}
          className="
            flex-1
            bg-zinc-800 border border-zinc-700
            rounded-xl
            px-4 py-2.5
            text-sm
            focus:outline-none focus:border-amber-400
            disabled:opacity-50
          "
        />
        <button
          onClick={handleApply}
          disabled={disabled || loading}
          className="
            bg-amber-400 hover:bg-amber-500
            disabled:opacity-50
            text-black
            px-4
            rounded-xl
            text-sm font-medium
          "
        >
          {loading ? "..." : "Áp dụng"}
        </button>
      </div>


      {disabled && (
        <p className="text-zinc-400 text-xs mt-1">
          Tối đa 3 mã giảm giá
        </p>
      )}

      {error && (
        <div
          className="
            mt-2
            text-red-400 text-xs
            bg-red-400/10 border border-red-400/30
            rounded-xl
            px-3 py-2
          "
          role="alert"
        >
          {error}
        </div>
      )}
    </>
  );
}