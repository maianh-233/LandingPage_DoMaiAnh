import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateRegisterForm } from "../../utils/authValidation";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
  });

  // Hàm này cập nhật state form khi người dùng nhập dữ liệu.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerMessage("");
  };

  // Hàm xử lý submit: kiểm tra validate trước rồi mới gửi lên backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validateRegisterForm(form);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerMessage("");

    try {
      const normalizedGender =
        form.gender === "male"
          ? "MALE"
          : form.gender === "female"
            ? "FEMALE"
            : form.gender === "other"
              ? "OTHER"
              : "OTHER";

      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        gender: normalizedGender,
        dateOfBirth: form.dateOfBirth,
        password: form.password,
      });
      navigate("/");
    } catch (error) {
      setServerMessage(error.message || "Đăng ký không thành công.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
        
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 relative bg-zinc-950 items-center justify-center overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/5f/40/b4/5f40b46b00416e256754aeff85b640db.jpg"
            alt="Lunaria Technology"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

          <div className="relative z-10 text-white text-center px-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="text-amber-300 w-10 h-10" />
              <h1 className="text-5xl tracking-widest font-serif">
                LUNARIA
              </h1>
            </div>

            <p className="text-3xl font-light text-amber-100">
              TECHNOLOGY
            </p>

            <p className="mt-8 text-lg text-zinc-100">
              Trở thành thành viên để nhận ưu đãi đặc biệt và trải nghiệm mua
              sắm tinh tế
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-6 flex flex-col justify-center">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="text-amber-300 w-8 h-8" />
              <h1 className="text-4xl tracking-widest text-white font-serif">
                LUNARIA
              </h1>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white">
              Tạo tài khoản mới
            </h2>

            <p className="text-zinc-400 mt-2">
              Tham gia LUNARIA TECHNOLOGY ngay hôm nay
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Họ và tên
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Nguyễn Thị Hoa"
                className="w-full bg-zinc-800 border border-white/10 focus:border-amber-400 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
              />
              {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-zinc-800 border border-white/10 focus:border-amber-400 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
                />
                {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Số điện thoại
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  placeholder="0123 456 789"
                  className="w-full bg-zinc-800 border border-white/10 focus:border-amber-400 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
                />
                {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
              </div>
            </div>

            {/* Gender + Birthday */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Giới tính
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-white/10 focus:border-amber-400 rounded-2xl py-4 px-5 text-white focus:outline-none transition-all"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Ngày sinh
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-white/10 focus:border-amber-400 rounded-2xl py-4 px-5 text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Mật khẩu
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-white/10 focus:border-amber-400 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
                />
                {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>



            {serverMessage && <p className="mt-2 text-sm text-red-400">{serverMessage}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold py-4 rounded-2xl text-lg shadow-xl shadow-amber-500/40 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Tạo tài khoản"
              )}
            </button>

            {/* Login */}
            <div className="text-center text-sm text-zinc-400 mt-6">
              Đã có tài khoản?{" "}
              <Link
                to="/customerlogin"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Đăng nhập
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-8 text-center">
            <p className="text-xs text-zinc-500">
              © 2026 Lunaria Technology. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}