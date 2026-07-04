import OrderItems from "../../components/customer/Checkout/OrderItems";
import OrderNote from "../../components/customer/Checkout/OrderNote";
import PriceSummary from "../../components/customer/Checkout/PriceSummary";
import Promotions from "../../components/customer/Checkout/Promotions";
import ShippingForm from "../../components/customer/Checkout/ShippingForm";



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function OrderDetailPage() {
  const { token, loading: authLoading } = useAuth();
  const { orderCode: orderCodeParam } = useParams();

  const orderCode = orderCodeParam;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const load = async () => {
      if (authLoading) return;
      if (!orderCode) return;
      if (!token) return;

      setLoading(true);
      setError("");
      try {
        const resp = await fetch(`${API_BASE_URL}/order/${orderCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.message || "Failed");
        setOrder(data);
      } catch (e) {
        setError(e.message);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [API_BASE_URL, authLoading, orderCode, token]);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
        <h1 className="text-3xl font-bold mb-8">Lỗi: {error}</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
        
      </div>
    );
  }

  return (
    <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-8">
        Chi tiết đơn hàng #{order.code}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-8">

          <OrderItems items={order.items} />

          
          <ShippingForm form={order.shipping_address} readOnly />
          

          <OrderNote value={order.note} readOnly />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 rounded-2xl p-6 sticky top-6 space-y-6">
            <Promotions promotions={order.promotions} readOnly />
            <PriceSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}