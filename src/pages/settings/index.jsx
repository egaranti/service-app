import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const SettingsLayout = () => {
  const { pathname } = useLocation();

  const getLinkClass = (path) =>
    pathname === path
      ? "block font-medium text-blue-600 text-sm underline"
      : "block font-medium text-gray-600 text-sm hover:text-black";

  const menuItems = [
    { path: "/settings", label: "Talep Durumları" },
    { path: "/settings/constants", label: "Sabitler" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f9fafc] px-6 py-6">
      <div className="container mx-auto flex space-x-6">
        <aside className="w-40 border-r border-gray-200">
          <nav className="flex flex-col items-start space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(item.path)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
