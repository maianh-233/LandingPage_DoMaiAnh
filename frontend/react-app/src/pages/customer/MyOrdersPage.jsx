import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Pagination from "../../components/common/Pagination";
import ChatModal from "../../components/customer/Chat/ChatModal";
import OrderFilter from "../../components/customer/Order/OrderFilter";
import OrderList from "../../components/customer/Order/OrderList";

const PAGE_SIZE = 6;

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();

  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");
  const [chatOrderId, setChatOrderId] = useState(null);
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return status
      ? orders.filter((o) => o.status === status)
      : orders;
  }, [orders, status]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const pagedOrders = useMemo(() => {
    return filteredOrders.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
  }, [filteredOrders, page]);

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

  useEffect(() => {
    const loadOrders = async () => {
      if (authLoading) return;
      if (!user?.id || !token) {
        setOrders([]);
        return;
      }

      setLoadingOrders(true);
      setError("");
      try {
        const resp = await fetch(`${API_BASE_URL}/order/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.message || "Failed");
        setOrders(data.orders || []);
      } catch (e) {
        setError(e.message);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [authLoading, user?.id, token]);

  return (
  <>
    {loadingOrders &&  (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="relative w-12 h-12 animate-spin">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-white/40 to-transparent" />
              <div className="absolute inset-[3px] rounded-full bg-black" />
            </div>

            {/* Text */}
            <span className="text-white/80 text-sm tracking-wide">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
    ) }
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-200">
      <div className="w-full px-3 sm:px-6 lg:px-10 py-4 sm:py-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Đơn Hàng Của Tôi
          </h1>

          <div className="w-full sm:w-auto">
            <OrderFilter
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1); // reset page khi đổi filter
              }}
            />
          </div>
        </div>

        {/* LIST */}
        <div className="h-[calc(100vh-230px)] overflow-y-auto overflow-hidden scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          { error ? (
            <div className="text-red-400 py-8">{error}</div>
          ) : (
            <OrderList
              orders={pagedOrders}
              onChat={setChatOrderId}
              onCancel={(id) => alert(`Hủy đơn ${id}`)}
              onOpen={(orderCode) =>
                navigate(`/orderdetail/${orderCode}`, { replace: true })
              }
            />
          )}
        </div>

        {/* PAGINATION (DESKTOP ONLY) */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* CHAT MODAL */}
        {chatOrderId && (
          <ChatModal
            orderId={chatOrderId}
            onClose={() => setChatOrderId(null)}
          />
        )}
      </div>
    </div>
  </>

  );
}