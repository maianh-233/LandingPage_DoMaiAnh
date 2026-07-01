import { BrowserRouter, Route, Routes } from "react-router-dom";

import CustomerLayout from "./components/customer/CustomerLayout";
import NotFound from "./pages/common/NotFound";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerInfo from "./pages/customer/CustomerInfor";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import ProductDetail from "./pages/customer/ProductDetail";
import ProductPage from "./pages/customer/ProductPage";
import PromotionPage from "./pages/customer/PromotionPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="promotions" element={<PromotionPage />} />
          <Route path="profile" element={<CustomerInfo />} />
          <Route path="carts" element={<CartPage/>} />
          <Route path="orders" element={<MyOrdersPage/>} />
          <Route path="checkout" element={<CheckoutPage />} />
          {/* NOTE: productdetail cần có productId theo route động */}
          <Route path="productdetail/:productId" element={<ProductDetail />} />
          <Route path="orderdetail" element={<OrderDetailPage />} />
        </Route>
      
        

        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customerregister" element={<CustomerRegister />} />
        

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
