import { useState, useRef } from "react";
import { X, Calendar } from "lucide-react";

function validateForm(form, password) {
  const errors = {};

  if (!form.name?.trim() || form.name.trim().length < 2) {
    errors.name = "Họ tên phải có ít nhất 2 ký tự.";
  }

  if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!form.phone?.trim() || !/^0\d{9,10}$/.test(form.phone.trim())) {
    errors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.";
  }

  if (!form.birthDate) {
    errors.birthDate = "Vui lòng chọn ngày sinh.";
  }

  if (password && password.length < 6) {
    errors.password = "Mật khẩu phải có tối thiểu 6 ký tự.";
  }

  return errors;
}

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dateRef = useRef(null);

  const submit = async () => {
    const validationErrors = validateForm(form, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSave({ ...form, password });
      onClose();
    } catch (error) {
      if (error.errors) {
        const mapped = {};
        if (error.errors.fullName) mapped.name = error.errors.fullName;
        if (error.errors.email) mapped.email = error.errors.email;
        if (error.errors.phone) mapped.phone = error.errors.phone;
        if (error.errors.dateOfBirth) mapped.birthDate = error.errors.dateOfBirth;
        if (error.errors.password) mapped.password = error.errors.password;
        setErrors(mapped);
      } else {
        setErrors({ form: error.message || "Không thể lưu thông tin." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-xl overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-zinc-700 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-amber-400">
            Sửa thông tin cá nhân
          </h3>
          <X
            onClick={onClose}
            className="cursor-pointer text-zinc-400 hover:text-white"
          />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          {errors.form && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-xl px-4 py-3">
              {errors.form}
            </p>
          )}

          {/* TÊN */}
          <div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Họ và tên"
              className="w-full bg-zinc-800 rounded-2xl px-5 py-4 text-zinc-200"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full bg-zinc-800 rounded-2xl px-5 py-4 text-zinc-200"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          {/* PHONE */}
          <div>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Số điện thoại"
              className="w-full bg-zinc-800 rounded-2xl px-5 py-4 text-zinc-200"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
          </div>

          {/* NGÀY SINH */}
          <div>
            <div className="relative">
              <input
                ref={dateRef}
                type="date"
                value={form.birthDate}
                onChange={(e) =>
                  setForm({ ...form, birthDate: e.target.value })
                }
                className="
                  w-full bg-zinc-800 rounded-2xl
                  px-5 py-4 pr-12
                  text-zinc-200
                  appearance-none
                "
              />

              <Calendar
                size={22}
                onClick={() => dateRef.current?.showPicker()}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  text-amber-400 cursor-pointer
                  hover:text-amber-300 transition
                "
              />
            </div>
            {errors.birthDate && <p className="mt-1 text-sm text-red-400">{errors.birthDate}</p>}
          </div>

          {/* ĐỔI MẬT KHẨU */}
          <div>
            <input
              type="password"
              placeholder="Mật khẩu mới (để trống nếu không đổi)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 rounded-2xl px-5 py-4 text-zinc-200"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          {/* ACTION */}
          <button
            onClick={submit}
            disabled={submitting}
            className="
              w-full bg-amber-500 hover:bg-amber-600
              disabled:opacity-60 disabled:cursor-not-allowed
              py-4 rounded-2xl font-bold text-black
              transition
            "
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>

        </div>
      </div>
    </div>
  );
}
