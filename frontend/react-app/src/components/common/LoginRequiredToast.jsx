export default function LoginRequiredToast({ message = "Vui lòng đăng nhập để tiếp tục" }) {
  return (
    <div
      role="alert"
      className="
        fixed left-1/2 top-5 z-[1000]
        w-[92vw] max-w-md
        -translate-x-1/2
        rounded-2xl border border-amber-400/40
        bg-zinc-900/90 backdrop-blur
        px-4 py-3
        text-sm text-zinc-200
        shadow-[0_0_30px_rgba(255,204,0,0.12)]
      "
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-amber-400">
          <i className="fa-solid fa-triangle-exclamation" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-300">Thông báo</p>
          <p className="mt-0.5 text-zinc-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

