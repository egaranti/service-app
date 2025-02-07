import { Button } from "@egaranti/components";

import { NavLink, Outlet } from "react-router-dom";

import egarantiLogo from "@/assets/egaranti-mini-logo.png";

import { Settings } from "lucide-react";

const MainLayout = () => {
  const links = [
    {
      to: "/requests",
      label: "Talepler",
    },
    {
      to: "/forms",
      label: "Formlar",
    },
  ];

  return (
    <div className="flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-8">
            <img
              src={egarantiLogo}
              alt="egaranti Logo"
              className="h-10 rounded-lg"
            />
            <nav className="flex gap-6">
              {links.map((link) => (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `border-b-2 border-transparent py-4 text-sm font-medium transition-colors hover:border-gray-300 ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "text-gray-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default MainLayout;
