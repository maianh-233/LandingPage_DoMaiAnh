import { useState } from "react";
import {
    orderData as mockOrderData,
    savedAddresses,
    store,
} from "../../hooks/mockCheckoutData";




import OrderItems from "../../components/customer/Checkout/OrderItems";
import PriceSummary from "../../components/customer/Checkout/PriceSummary";
import Promotions from "../../components/customer/Checkout/Promotions";
import SavedAddresses from "../../components/customer/Checkout/SavedAddresses";
import ShippingForm from "../../components/customer/Checkout/ShippingForm";
import StoreInfo from "../../components/customer/Checkout/StoreInfo";

import OrderNote from "../../components/customer/Checkout/OrderNote";
import PaymentMethodSelector from "../../components/customer/Checkout/PaymentMethodSelector";

export default function CheckoutPage() {
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
        promotions: appliedPromos.map((p) => ({
          code: p.code,
          name: p.code,
          discount: Number(p.amount || 0),
        })),
        discount_total,
        shipping_fee: 30000,
      };
    } catch {
      return mockOrderData;
    }
  });


  /* ========= TYPE & PAYMENT ========= */
  const [orderType] = useState("ONLINE"); // ONLINE | PICKUP
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD | VNPAY
  const [pickupStore] = useState(null);


  /* ========= NOTE ========= */
  const [note, setNote] = useState("");

  /* ========= SHIPPING FORM ========= */
  const defaultAddress =
    savedAddresses.find(a => a.is_default) || {
      receiver_name: "",
      receiver_phone: "",
      province: "",
      district: "",
      ward: "",
      address_line: "",
      latitude: null,
      longitude: null,
    };

  const [shippingForm, setShippingForm] = useState(defaultAddress);

  /* ========= SIDE EFFECT ========= */




  /* ========= UI ========= */
  return (
    <div className="w-full xl:px-12 px-4 py-8 text-gray-200">
      <h1 className="text-3xl font-bold text-white mb-8">
        Thanh Toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-7 space-y-8">
          {/* DANH SÁCH SẢN PHẨM */}
          <OrderItems items={order.items} />



          {/* ========== ONLINE ========== */}
          {orderType === "ONLINE" && (
            <>
              <SavedAddresses
                addresses={savedAddresses}
                onSelect={addr => setShippingForm(addr)}
              />

              <ShippingForm
                form={shippingForm}
                setForm={setShippingForm}
              />

            </>
          )}

          {/* ========== PICKUP ========== */}
          {orderType === "PICKUP" && pickupStore && (
            <StoreInfo store={pickupStore} />
          )}

          {/* NOTE */}
          <OrderNote
            value={note}
            onChange={setNote}
          />

          {/* THANH TOÁN */}
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 rounded-2xl p-6 sticky top-6 space-y-6">
            <StoreInfo store={store} />

            <Promotions promotions={order.promotions} />


            <PriceSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}