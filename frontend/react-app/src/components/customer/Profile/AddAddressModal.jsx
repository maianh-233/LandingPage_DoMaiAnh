import { useState } from "react";
import { X } from "lucide-react";

function validateForm(form) {
  const errors = {};

  if (!form.receiver_name?.trim() || form.receiver_name.trim().length < 2) {
    errors.receiver_name = "Tên người nhận phải có ít nhất 2 ký tự.";
  }

  if (!form.receiver_phone?.trim() || !/^0\d{9,10}$/.test(form.receiver_phone.trim())) {
    errors.receiver_phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.";
  }

  if (!form.province?.trim()) {
    errors.province = "Vui lòng nhập Tỉnh / Thành phố.";
  }

  if (!form.district?.trim()) {
    errors.district = "Vui lòng nhập Quận / Huyện.";
  }

  if (!form.ward?.trim()) {
    errors.ward = "Vui lòng nhập Phường / Xã.";
  }

  if (!form.address_line?.trim()) {
    errors.address_line = "Vui lòng nhập địa chỉ chi tiết.";
  }

  return errors;
}

export default function AddAddressModal({ defaultPhone = "", onAdd, onClose }) {
  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: defaultPhone,
    province: "",
    district: "",
    ward: "",
    address_line: "",
    postal_code: "",
    address_type: "HOME",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onAdd({
        receiver_name: form.receiver_name.trim(),
        receiver_phone: form.receiver_phone.trim(),
        province: form.province.trim(),
        district: form.district.trim(),
        ward: form.ward.trim(),
        address_line: form.address_line.trim(),
        postal_code: form.postal_code.trim(),
        address_type: form.address_type,
      });
      onClose();
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ form: error.message || "Không thể lưu địa chỉ." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "bg-zinc-800 rounded-xl px-4 py-4 text-zinc-200 w-full";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center">

      <div
        className="
          bg-zinc-900 w-full sm:max-w-2xl
          rounded-t-3xl sm:rounded-3xl
          max-h-[90vh] overflow-y-auto
        "
      >

        <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 p-4 sm:p-6 flex justify-between items-center">
          <h3 className="text-lg sm:text-2xl font-bold text-amber-400">
            Thêm địa chỉ giao hàng
          </h3>
          <X
            onClick={onClose}
            className="cursor-pointer text-zinc-300 hover:text-white"
          />
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {errors.form && (
            <p className="sm:col-span-2 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-xl px-4 py-3">
              {errors.form}
            </p>
          )}

          <div className="sm:col-span-2">
            <input
              name="receiver_name"
              placeholder="Tên người nhận"
              value={form.receiver_name}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.receiver_name && <p className="mt-1 text-sm text-red-400">{errors.receiver_name}</p>}
          </div>

          <div className="sm:col-span-2">
            <input
              name="receiver_phone"
              placeholder="Số điện thoại"
              value={form.receiver_phone}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.receiver_phone && <p className="mt-1 text-sm text-red-400">{errors.receiver_phone}</p>}
          </div>

          <div>
            <input
              name="province"
              placeholder="Tỉnh / Thành phố"
              value={form.province}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.province && <p className="mt-1 text-sm text-red-400">{errors.province}</p>}
          </div>

          <div>
            <input
              name="district"
              placeholder="Quận / Huyện"
              value={form.district}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.district && <p className="mt-1 text-sm text-red-400">{errors.district}</p>}
          </div>

          <div>
            <input
              name="ward"
              placeholder="Phường / Xã"
              value={form.ward}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.ward && <p className="mt-1 text-sm text-red-400">{errors.ward}</p>}
          </div>

          <div>
            <input
              name="postal_code"
              placeholder="Mã bưu điện"
              value={form.postal_code}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <textarea
              name="address_line"
              placeholder="Địa chỉ chi tiết"
              value={form.address_line}
              onChange={handleChange}
              className={`${inputClass} h-24 resize-none`}
            />
            {errors.address_line && <p className="mt-1 text-sm text-red-400">{errors.address_line}</p>}
          </div>

          <select
            name="address_type"
            value={form.address_type}
            onChange={handleChange}
            className="sm:col-span-2 bg-zinc-800 rounded-xl px-4 py-4 text-zinc-200"
          >
            <option value="HOME">Nhà riêng</option>
            <option value="WORK">Công ty</option>
            <option value="OTHER">Khác</option>
          </select>

          <button
            onClick={submit}
            disabled={submitting}
            className="
              sm:col-span-2
              bg-amber-500 hover:bg-amber-600
              disabled:opacity-60 disabled:cursor-not-allowed
              py-4 rounded-xl
              font-bold text-black text-lg
              active:scale-[0.98]
            "
          >
            {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </div>
      </div>
    </div>
  );
}
