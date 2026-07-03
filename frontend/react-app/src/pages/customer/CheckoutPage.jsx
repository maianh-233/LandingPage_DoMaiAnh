import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    orderData as mockOrderData,
} from "../../hooks/mockCheckoutData";

import OrderItems from "../../components/customer/Checkout/OrderItems";
import OrderNote from "../../components/customer/Checkout/OrderNote";
import PaymentMethodSelector from "../../components/customer/Checkout/PaymentMethodSelector";
import PriceSummary from "../../components/customer/Checkout/PriceSummary";
import Promotions from "../../components/customer/Checkout/Promotions";
import SavedAddresses from "../../components/customer/Checkout/SavedAddresses";
import ShippingForm from "../../components/customer/Checkout/ShippingForm";

import { getAddresses } from "../../services/profileService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user: authUser, token, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [note, setNote] = useState("");

  const SHIPPING_FEE = 30000;
  const TAX_RATE = 0;

  /* ========= ORDER ========= */
  const [order] = useState(() => {
    try {
      const raw = localStorage.getItem("appliedPromos");
      if (!raw) return mockOrderData;

      const parsed = JSON.parse(raw);
      const appliedPromos = parsed?.appliedPromos || [];
      const items = parsed?.items || mockOrderData.items;

      const discount_total = appliedPromos.reduce(
        (s, p) => s + Number(p.amount || 0),
        0
      );

      return {
        ...mockOrderData,
        items,
        promotions: appliedPromos.map(p => ({
          code: p.code,
          name: p.code,
          discount: Number(p.amount || 0),
        })),
        discount_total,
        shipping_fee: SHIPPING_FEE,
      };
    } catch {
      return mockOrderData;
    }
  });

  /* ========= LOAD ADDRESS ========= */
  useEffect(() => {
    if (authLoading) return;

    if (!authUser || !token) {
      navigate("/customerlogin");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getAddresses(token);
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, [authLoading, authUser, token, navigate]);

  /* ========= CALCULATE ========= */
  const subtotal = useMemo(() => (
    order.items.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    )
  ), [order.items]);

  const discountTotal = useMemo(() => (
    order.promotions.reduce(
      (sum, p) => sum + Number(p.discount || 0),
      0
    )
  ), [order.promotions]);

  const tax = useMemo(
    () => Math.round(subtotal * TAX_RATE),
    [subtotal]
  );

  const total = useMemo(() => (
    Math.max(0, subtotal - discountTotal) + tax + SHIPPING_FEE
  ), [subtotal, discountTotal, tax]);

  const orderSummary = {
    subtotal,
    tax,
    items: order.items,
    promotions: order.promotions,
    discount_total: discountTotal,
    shipping_fee: SHIPPING_FEE,
    total,
  };

  /* ========= TYPE & PAYMENT ========= */
  const [orderType] = useState("ONLINE");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  /* ========= SHIPPING ========= */
  const [shippingForm, setShippingForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    province: "",
    district: "",
    ward: "",
    address_line: "",
  });

  useEffect(() => {
    // Set default address only when needed
    const addr = addresses.find(a => a.is_default);
    if (!addr) return;

    setShippingForm((prev) => {
      if (prev?.id === addr.id) return prev;
      return addr;
    });
  }, [addresses]);




  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmPayment = async () => {
    if (isConfirming) return;

    if (!authUser?.id || !token) {
      navigate("/customerlogin");
      return;
    }

    setIsConfirming(true);


    // items cart đã chọn được lưu trong localStorage dưới key "appliedPromos" (được set từ CartPage)
    const raw = localStorage.getItem("appliedPromos");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const selectedItems = parsed?.items || [];
    const appliedPromos = parsed?.appliedPromos || [];

    // Map cart item -> format backend đang nhận: productVariantId, quantity, ...
    // cart item dùng field variantId
    const itemsPayload = selectedItems.map(it => ({
      productVariantId: it.variantId,
      quantity: Number(it.quantity || 1),
    }));

    const promotionsPayload = appliedPromos
      .map(p => ({
        // backend order.routes.js đang lấy promotionId từ promotions[].promotionId
        // trong CartPage chúng ta chỉ lưu code + amount, nên gửi promotionId bằng null sẽ fail.
        // vì yêu cầu của bạn: không kiểm tra tồn kho, nhưng vẫn cần promotionId hợp lệ.
        // nếu bạn muốn tạm thời bỏ promotions khi tạo order, backend sẽ không tính giảm giá.
        promotionId: null,
        code: p.code,
        discountAmount: Number(p.amount || 0),
      }))
      .filter(p => p.promotionId);

    // shippingForm chứa object address đã chọn từ SavedAddresses
    const customerAddressId = shippingForm?.id || null;

    const body = {
      userId: authUser.id,
      customerAddressId,
      note,
      items: itemsPayload,
      promotions: promotionsPayload,
    };

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

    await fetch(`${API_BASE_URL}/order/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }).then(async (resp) => {
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.message || "Tạo đơn thất bại");
      }
    });

    // quay về orders
    navigate("/orders");
  };

  /* ========= UI ========= */
  return (
    <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
      <h1 className="text-3xl font-bold text-white mb-8">
        Thanh Toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-8">
          <OrderItems items={order.items} />

          {orderType === "ONLINE" && (
            <>
              <SavedAddresses
                addresses={addresses}
                onSelect={setShippingForm}
              />

              <ShippingForm
                form={shippingForm}
                setForm={setShippingForm}
              />
            </>
          )}

          <OrderNote value={note} onChange={setNote} />

          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 rounded-2xl p-6 sticky top-6 space-y-6">
            <Promotions promotions={order.promotions} />
            <PriceSummary order={orderSummary} />

            <button
              onClick={handleConfirmPayment}
              disabled={isConfirming}
              className={`
                w-full mt-4 py-4 rounded-xl
                text-black font-bold text-lg
                transition-all
                ${isConfirming
                  ? "bg-amber-600/60 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400"}
              `}
            >
              {isConfirming ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}