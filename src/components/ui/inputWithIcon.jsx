import { Input } from "@egaranti/components";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const InputWithIcon = forwardRef(
  ({ className, icon, iconPosition = "left", ...props }, ref) => {
    return (
      <div className="flex">
        {iconPosition === "left" && (
          <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-[#CDD5E0] bg-[#F2F5F9] px-4">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            "flex-1",
            iconPosition === "left" ? "rounded-l-none" : "rounded-r-none",
            className,
          )}
          ref={ref}
          {...props}
        />
        {iconPosition === "right" && (
          <div className="flex items-center justify-center rounded-r-lg border border-l-0 border-[CDD5E0] bg-[#F2F5F9] px-4">
            {icon}
          </div>
        )}
      </div>
    );
  },
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
