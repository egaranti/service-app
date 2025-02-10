import { Button } from "@egaranti/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";

import { NavLink, Outlet } from "react-router-dom";

import egarantiLogo from "@/assets/egaranti-mini-logo.png";

import { LogOutIcon, Settings, UserCircle } from "lucide-react";

const MainLayout = () => {
  const links = [
    { to: "/requests", label: "Talepler" },
    { to: "/forms", label: "Formlar" },
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
            <span className="ml-2 font-medium text-gray-900">/ Karcher</span>
          </div>
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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="transition-colors duration-200 hover:bg-gray-100"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem className="transition-colors duration-150 hover:bg-gray-50">
                  <UserCircle className="mr-2 h-4 w-4" />
                  +53 555 01 22
                </DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-150 hover:bg-gray-50">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Çıkış
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};

export default MainLayout;
