import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "lunaria_auth_token";
const USER_KEY = "lunaria_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [loading, setLoading] = useState(true);

  // Khi ứng dụng khởi động, nếu có token thì tự động gọi API để lấy thông tin người dùng hiện tại.
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch (error) {
        console.error(error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Đăng nhập: lưu token và dữ liệu người dùng vào localStorage để dùng cho các request sau.
  const login = async (payload) => {
    const data = await loginUser(payload);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  };

  // Đăng ký: sau khi tạo tài khoản thành công, tự động đăng nhập luôn.
  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  };

  // Đăng xuất: xoá token khỏi storage và gọi API huỷ phiên nếu có.
  const logout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setToken("");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
