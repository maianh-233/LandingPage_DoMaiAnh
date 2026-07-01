// Kiểm tra dữ liệu trước khi gửi đi để giảm lỗi và tăng trải nghiệm người dùng.
export function validateRegisterForm(values) {
  const errors = {};

  if (!values.fullName || values.fullName.trim().length < 2) {
    errors.fullName = "Họ tên phải có ít nhất 2 ký tự.";
  }

  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!values.phone || !/^0\d{9,10}$/.test(values.phone)) {
    errors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.";
  }

  if (!values.password || values.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  if (!values.gender) {
    errors.gender = "Vui lòng chọn giới tính.";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Vui lòng chọn ngày sinh.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Kiểm tra thông tin đăng nhập trước khi gửi lên backend.
export function validateLoginForm(values) {
  const errors = {};

  if (!values.email) {
    errors.email = "Email là bắt buộc.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!values.password) {
    errors.password = "Mật khẩu là bắt buộc.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
