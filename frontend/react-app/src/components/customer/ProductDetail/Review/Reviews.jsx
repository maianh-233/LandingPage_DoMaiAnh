import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

export default function Reviews() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-white">
        Đánh giá từ người dùng
      </h2>

      <div className="space-y-10">
        <ReviewList />
        <ReviewForm />
      </div>
    </section>
  );
}