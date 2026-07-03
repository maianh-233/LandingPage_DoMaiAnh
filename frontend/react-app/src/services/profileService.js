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
    const error = new Error(data.message || "Yêu cầu không thành công.");
    error.errors = data.errors || null;
    throw error;
  }

  return data;
}

export function mapUserToProfile(user) {
  return {
    name: user.fullName || "Người dùng",
    email: user.email || "",
    phone: user.phone || "",
    birthDate: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
  };
}

export function mapProfileToPayload(profile, password = "") {
  const payload = {
    fullName: profile.name.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    dateOfBirth: profile.birthDate,
  };

  if (password) {
    payload.password = password;
  }

  return payload;
}

export async function updateProfile(token, profile, password = "") {
  return request("/auth/profile", {
    method: "PUT",
    token,
    body: mapProfileToPayload(profile, password),
  });
}

export async function getAddresses(token) {
  return request("/addresses", { token });
}

export async function createAddress(token, address) {
  return request("/addresses", {
    method: "POST",
    token,
    body: address,
  });
}

export async function deleteAddress(token, addressId) {
  return request(`/addresses/${addressId}`, {
    method: "DELETE",
    token,
  });
}

export async function setDefaultAddress(token, addressId) {
  return request(`/addresses/${addressId}/default`, {
    method: "PATCH",
    token,
  });
}
