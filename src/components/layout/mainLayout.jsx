import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";

import { NavLink, Outlet } from "react-router-dom";

import MerchantSelector from "./MerchantSelector";

import useAuthStore from "@/stores/useAuthStore";

import egarantiLogo from "@/assets/egaranti-mini-logo.png";

import {
  ClipboardList,
  Cog,
  FileText,
  LogOutIcon,
  Users,
  Wrench,
} from "lucide-react";

const MainLayout = () => {
  const { merchantId, logout } = useAuthStore();

  const links = [
    { to: "/requests", label: "Talepler", icon: ClipboardList },
    { to: "/forms", label: "Formlar", icon: FileText },
    { to: "/users", label: "Personeller", icon: Users },
    { to: "/technical-services", label: "Teknik Servisler", icon: Wrench },
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
          {/* Settings icon button dropdown inside */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondaryGray" size="sm">
                <Cog size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon size={18} />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="container relative mx-auto">
          <div className="flex items-center justify-between px-4">
            <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 flex w-full gap-6 overflow-x-auto">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative flex-shrink-0 whitespace-nowrap py-3 text-sm font-medium transition-all duration-200 ${
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
                  <div className="flex items-center gap-2">
                    <link.icon size={18} />
                    {link.label}
                  </div>
                </NavLink>
              ))}
            </div>
            <div className="flex items-center gap-2"></div>
          </div>
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
