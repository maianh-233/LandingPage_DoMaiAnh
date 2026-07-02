import { Outlet } from "react-router-dom";
import { navLinks } from "../../hooks/storefrontData";
import CustomerChatWidget from "./CustomerChatWidget";
import StorefrontFooter from "./StorefrontFooter";
import StorefrontHeader from "./StorefrontHeader";

import { useAuth } from "../../context/AuthContext";
import useCartCount from "../../hooks/useCartCount";

export default function CustomerLayout() {
  const { user } = useAuth();
  const cartCount = useCartCount(user);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col">
      <StorefrontHeader navLinks={navLinks} cartCount={cartCount} />


      <main className="flex-1">
        <Outlet />
      </main>

      <StorefrontFooter />

      {/* Floating Chat Widget */}
      <CustomerChatWidget />
    </div>
  );
}