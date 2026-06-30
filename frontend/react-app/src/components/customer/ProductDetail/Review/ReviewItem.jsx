export default function ReviewItem({ review }) {
  return (
    <div className="
      group
      relative
      rounded-2xl
      border border-zinc-800
      bg-gradient-to-br from-zinc-900 to-zinc-950
      p-5
      transition
      hover:border-amber-500/40
      hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]
    ">
      {/* Glow layer */}
      <div className="
        pointer-events-none
        absolute inset-0
        rounded-2xl
        opacity-0
        transition
        group-hover:opacity-100
        bg-gradient-to-br
        from-amber-500/10
        to-transparent
      " />

      {/* Header */}
      <div className="relative z-10 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar chữ */}
          <div className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-gradient-to-br from-amber-400 to-orange-600
            font-bold text-black
          ">
            {review.name.charAt(0)}
          </div>

          <div>
            <p className="font-medium text-white leading-tight">
              {review.name}
            </p>
            <span className="
              inline-block
              mt-0.5
              rounded-full
              border border-zinc-700
              px-2 py-0.5
              text-[11px]
              text-zinc-400
            ">
              {review.date}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="text-amber-400 text-lg tracking-wide">
          {"★".repeat(review.rating)}
          <span className="text-zinc-600">
            {"☆".repeat(5 - review.rating)}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="
        relative z-10
        text-sm
        text-zinc-300
        leading-relaxed
        pl-4
        border-l-2
        border-amber-500/40
      ">
        {review.comment}
      </p>
    </div>
  );
}