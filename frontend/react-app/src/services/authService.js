const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) {
    const normalizedUrl = envUrl.replace(/\/$/, "");
    return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
  }

  if (import.meta.env.PROD) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/api`;
  }

  return "http://localhost:5000/api";
})();

function buildHeaders(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(endpoint, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Yêu cầu không thành công.");
  }

  return data;
}

// Gửi thông tin đăng ký lên backend sau khi đã qua validation ở phía client.
export async function registerUser(payload) {
  return request("/auth/register", { method: "POST", body: payload });
}

// Gửi thông tin đăng nhập lên backend để nhận token và dữ liệu người dùng.
export async function loginUser(payload) {
  return request("/auth/login", { method: "POST", body: payload });
}

// Lấy thông tin người dùng hiện tại bằng token đã lưu.
export async function getCurrentUser(token) {
  return request("/auth/me", { method: "GET", token });
}

// Huỷ phiên đăng nhập hiện tại trên backend.
export async function logoutUser(token) {
  return request("/auth/logout", { method: "POST", token });
}
