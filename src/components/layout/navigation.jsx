import { NavLink } from "react-router-dom";

import { ClipboardList, FileText, Users, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { to: "/requests", label: "Talepler", icon: ClipboardList },
  { to: "/forms", label: "Formlar", icon: FileText },
  { to: "/users", label: "Personeller", icon: Users },
  { to: "/technical-services", label: "Teknik Servisler", icon: Wrench },
];

const Navigation = ({ className, props }) => {
  return (
    <nav
      className={cn(
        "container relative mx-auto border-b border-gray-50",
        className,
      )}
      {...props}
    >
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
  );
};

export default Navigation;
