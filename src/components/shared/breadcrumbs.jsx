/* eslint-disable react/prop-types */
import { Children, cloneElement } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

const Breadcrumb = ({ children }) => {
  const navigate = useNavigate();

  const handleClick = (link, isActive) => {
    if (!isActive) navigate(link);
  };

  return (
    <nav className="flex w-full gap-2 bg-[#F2F5F9] px-[72px] py-4">
      {Children.map(children, (child, index) =>
        cloneElement(child, { index, handleClick }),
      )}
    </nav>
  );
};

const BreadcrumbItem = ({ index, children, link, active, handleClick }) => {
  return (
    <div className="flex items-center">
      {index > 0 && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="#97A2B6"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <button
        type="button"
        onClick={() => handleClick(link, active)}
        className={cn(
          "cursor-pointer font-medium text-[#677389] underline",
          active && "cursor-default text-[#0049E6] no-underline",
        )}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </button>
    </div>
  );
};

export { Breadcrumb, BreadcrumbItem };
