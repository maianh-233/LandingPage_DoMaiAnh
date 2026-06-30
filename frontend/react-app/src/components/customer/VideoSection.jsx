export default function VideoSection() {
  return (
    <section className="mt-16 sm:mt-20 lg:mt-24">
      
      <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-500 bg-zinc-700 aspect-[16/7]">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/sVTlP0_jTUM"
          title="Lunaria Fashion Story"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>
      
      <p className="mt-6 text-center text-zinc-400 max-w-2xl mx-auto">
        Lunaria – định hình trải nghiệm mới giữa sáng tạo, công nghệ và di sản.
      </p>
    </section>
  );
}
