import { BrowserRouter, Route, Routes } from "react-router-dom";

import CustomerLayout from "./components/customer/CustomerLayout";
import NotFound from "./pages/common/NotFound";
import BrandPage from "./pages/customer/BrandPage";

import CustomerHome from "./pages/customer/CustomerHome";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import ProductPage from "./pages/customer/ProductPage";
import PromotionPage from "./pages/customer/PromotionPage";
import CustomerInfo from "./pages/customer/CustomerInfor";
import CartPage from "./pages/customer/CartPage";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import ProductDetail from "./pages/customer/ProductDetail";
import OrderDetailPage from "./pages/customer/OrderDetailPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="promotions" element={<PromotionPage />} />
          <Route path="brand" element={<BrandPage />} />
          <Route path="profile" element={<CustomerInfo />} />
          <Route path="carts" element={<CartPage/>} />
          <Route path="orders" element={<MyOrdersPage/>} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="productdetail" element={<ProductDetail />} />
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
