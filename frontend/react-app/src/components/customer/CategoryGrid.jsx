export default function CategoryGrid({ categories }) {
  return (
    <section className="mb-10 sm:mb-14 lg:mb-16 px-4 sm:px-0">
      {/* Title */}
      <h2 className="mb-6 sm:mb-10 text-lg sm:text-3xl font-light tracking-[0.18em] sm:tracking-[0.25em]">
        DANH MỤC
      </h2>

      {/* Grid */}
      <div
        className="
          grid grid-cols-3
          gap-4
          sm:grid-cols-4 sm:gap-5
          lg:grid-cols-8 lg:gap-6
        "
      >
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="
      group
      flex flex-col items-center
      text-center
      transition
      active:scale-95
    "
          >
            {/* Icon */}
            <div
              className="
        mx-auto
        flex h-14 w-14
        items-center justify-center
        rounded-xl
        bg-zinc-900
        text-2xl text-white
        transition-all duration-300 ease-out

        active:bg-amber-500

        sm:h-[4.5rem] sm:w-[4.5rem] sm:text-4xl
        lg:h-20 lg:w-20 lg:rounded-3xl

        sm:group-hover:scale-110
        sm:group-hover:bg-gradient-to-br
        sm:group-hover:from-amber-400
        sm:group-hover:to-orange-500

        sm:group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.35)]
      "
            >
              {category.icon}
            </div>

            {/* Label */}
            <p
              className="
        mt-2
        text-[11px]
        font-medium
        text-zinc-400
        transition-colors duration-300

        active:text-amber-400

        sm:mt-4 sm:text-sm
        sm:group-hover:text-amber-400
      "
            >
              {category.label}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
