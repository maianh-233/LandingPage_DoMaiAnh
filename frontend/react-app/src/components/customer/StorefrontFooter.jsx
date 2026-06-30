function BrandBlock() {
  return (
    <div>
      <div className="mb-6">
        <img 
          src="/LUNARIALOGO.png" 
          alt="Lunaria Logo" 
          className="h-12 w-auto"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        <div className="flex items-center gap-3 hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-xl font-bold text-black">
            L
          </div>
          <span className="text-2xl font-light">LUNARIA TECH</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-400">
        Nền tảng công nghệ hiện đại tập trung vào trải nghiệm số, giải pháp thông minh và thiết kế giao diện tối ưu cho người dùng.
      </p>
    </div>
  );
}

const footerColumns = [
  {
    title: "Sản Phẩm",
    links: ["Tính Năng Mới", "Giải Pháp AI", "API & SDK", "Bảng Giá"],
  },
  {
    title: "Hỗ Trợ",
    links: ["Tài Liệu Kỹ Thuật", "Trung Tâm Trợ Giúp", "FAQ", "Liên Hệ Kỹ Thuật"],
  },
];

export default function StorefrontFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-16">
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <BrandBlock />

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 font-medium">{column.title}</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 font-medium">Liên Hệ</h4>
            <p className="text-sm text-zinc-400">
              Hotline: <span className="text-white">+84 1800 123 456</span>
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Email: <span className="text-white">dev@lunaria.tech</span>
            </p>

            <div className="mt-6 flex gap-4">
              <i className="fa-brands fa-github cursor-pointer text-xl transition hover:text-cyan-400" />
              <i className="fa-brands fa-linkedin cursor-pointer text-xl transition hover:text-cyan-400" />
              <i className="fa-brands fa-x-twitter cursor-pointer text-xl transition hover:text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-8 text-center text-xs text-zinc-500">
          © 2026 LUNARIA TECH. Built for modern digital experiences. | Privacy Policy | Terms
        </div>
      </div>
    </footer>
  );
}