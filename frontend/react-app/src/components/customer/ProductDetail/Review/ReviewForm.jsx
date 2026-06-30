import { useState } from "react";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <form
      className="
        mt-12
        rounded-2xl
        border border-zinc-800
        bg-gradient-to-br from-zinc-900 to-zinc-950
        p-6
      "
    >
      <h3 className="mb-6 text-lg font-semibold text-white">
        Viết đánh giá của bạn
      </h3>

      {/* Rating */}
      <div className="mb-6">
        <p className="mb-2 text-sm text-zinc-300">Đánh giá của bạn</p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="
                text-3xl
                transition
                hover:scale-110
                active:scale-95
              "
            >
              <span
                className={
                  star <= (hover || rating)
                    ? "text-amber-400"
                    : "text-zinc-600"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="mt-2 text-xs text-amber-400">
            Bạn đã chọn {rating} / 5 sao
          </p>
        )}
      </div>

      {/* Name */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tên của bạn"
          className="
            w-full
            rounded-lg
            bg-zinc-800
            px-4 py-2.5
            text-sm
            text-white
            outline-none
            transition
            focus:ring-2
            focus:ring-amber-400
          "
        />
      </div>

      {/* Comment */}
      <div className="mb-6">
        <textarea
          rows="4"
          placeholder="Cảm nhận của bạn về sản phẩm"
          className="
            w-full
            rounded-lg
            bg-zinc-800
            px-4 py-2.5
            text-sm
            text-white
            outline-none
            transition
            focus:ring-2
            focus:ring-amber-400
            resize-none
          "
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={rating === 0}
          className="
            rounded-full
            bg-gradient-to-r from-amber-400 to-orange-500
            px-8 py-3
            text-sm font-semibold
            text-black
            transition
            hover:brightness-110
            hover:shadow-[0_0_25px_rgba(251,191,36,0.45)]
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Gửi đánh giá
        </button>
      </div>
    </form>
  );
}