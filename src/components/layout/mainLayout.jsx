import { NavLink, Outlet } from "react-router-dom";

import MerchantSelector from "./MerchantSelector";

import useAuthStore from "@/stores/useAuthStore";

import egarantiLogo from "@/assets/egaranti-mini-logo.png";

const MainLayout = () => {
  const { merchantId } = useAuthStore();

  const links = [
    { to: "/requests", label: "Talepler" },
    { to: "/forms", label: "Formlar" },
    { to: "/users", label: "Personeller" },
    { to: "/technical-services", label: "Teknik Servisler" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        {/* Top Section */}
        <div className="container mx-auto flex items-center justify-between p-4 pb-1">
          <div className="flex items-center">
            <img
              src={egarantiLogo}
              alt="egaranti Logo"
              className="h-6 rounded-lg transition-transform duration-200 hover:scale-105"
            />
            <span className="ml-2 font-medium text-gray-900">
              / {merchantId}
            </span>
          </div>
          <MerchantSelector />
        </div>

        <nav className="container mx-auto flex items-center justify-between px-4">
          <div className="flex gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:transition-transform after:duration-200 ${
                    isActive
                      ? "after:scale-x-100 after:bg-blue-600"
                      : "after:scale-x-0 after:bg-gray-300 hover:after:scale-x-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2"></div>
        </nav>
      </header>
      <Outlet />
      <footer className="border-t bg-white p-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © 2025 egaranti. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
