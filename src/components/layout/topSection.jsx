import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";

import { useEffect, useRef, useState } from "react";

import MerchantSelector from "./merchantSelector";
import Navigation from "./navigation";

import useAuthStore from "@/stores/useAuthStore";

import egarantiLogo from "@/assets/egaranti-mini-logo.png";

import { Cog, LogOutIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TopSection = () => {
  const { merchantId, logout } = useAuthStore();
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);
  const [offset, setOffset] = useState(0);

  // Get the initial offset position of the element
  useEffect(() => {
    if (stickyRef.current) {
      setOffset(stickyRef.current.offsetTop);
    }
  }, []);

  // Update the sticky state based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.pageYOffset > offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return (
    <div
      ref={stickyRef}
      className={cn("sticky top-0 z-10 bg-white transition-all", {
        "border-b pb-2": isSticky,
      })}
    >
      <div
        className={cn(
          "container mx-auto flex items-center justify-between p-4 pb-1",
        )}
      >
        <div className="flex items-center">
          <img
            src={egarantiLogo}
            alt="egaranti Logo"
            className={cn("h-6 rounded-lg transition-all duration-200", {
              "h-7": isSticky,
            })}
          />
          <span className="ml-2 font-medium text-gray-900">/ {merchantId}</span>
        </div>
        <div className="flex items-center gap-2">
          <MerchantSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondaryGray"
                size="sm"
                className={cn("flex items-center gap-1 transition-all", {
                  hidden: isSticky,
                })}
              >
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
      </div>
    </div>
  );
};

export default TopSection;
