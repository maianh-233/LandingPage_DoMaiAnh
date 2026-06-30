import ReviewItem from "./ReviewItem";

const reviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Âm thanh rất tốt, bass mạnh, pin trâu.",
    date: "20/06/2026",
  },
  {
    id: 2,
    name: "Trần Thị B",
    rating: 4,
    comment: "Đeo êm, chống ồn ổn trong tầm giá.",
    date: "18/06/2026",
  },
    {
    id: 3,
    name: "Nguyễn Văn C",
    rating: 5,
    comment: "Âm thanh rất tốt, bass mạnh, pin trâu.",
    date: "20/06/2026",
  },
  {
    id: 4,
    name: "Trần Thị D",
    rating: 4,
    comment: "Đeo êm, chống ồn ổn trong tầm giá.",
    date: "18/06/2026",
  },
];

export default function ReviewList() {
  return (
    <section className="mt-10">
      <h3 className="mb-6 text-lg font-semibold text-white">
        Đánh giá từ người dùng
        <span className="ml-2 text-sm text-zinc-400">
          ({reviews.length} đánh giá)
        </span>
      </h3>

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Xem thêm */}
      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="
            relative
            rounded-full
            border border-amber-500/50
            bg-zinc-950
            px-7 py-2.5
            text-sm font-medium
            text-amber-400
            transition
            hover:border-amber-400
            hover:text-amber-300
            hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]
            active:scale-95
          "
        >
          {/* Glow nền */}
          <span
            className="
              pointer-events-none
              absolute inset-0
              rounded-full
              bg-amber-500/10
              blur-lg
              opacity-0
              transition
              group-hover:opacity-100
            "
          />
          Xem thêm bình luận
        </button>
      </div>
    </section>
  );
}