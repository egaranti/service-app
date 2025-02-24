import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";

import React from "react";

import useAuthStore from "@/stores/useAuthStore";

import { ChevronDown, StoreIcon } from "lucide-react";

const MerchantSelector = () => {
  const { merchants, merchantId, setMerchantId } = useAuthStore();
  const currentMerchant = merchants.find((m) => m.id === merchantId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-opacity-45 hover:bg-gray-100">
        <StoreIcon className="h-5 w-5" />
        {currentMerchant?.name || "Select Merchant"}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px] bg-white p-2">
        {merchants.map((merchant) => (
          <DropdownMenuItem
            className="p-3"
            key={merchant.id}
            checked={merchant.id === merchantId}
            onSelect={() => setMerchantId(merchant.id)}
          >
            <StoreIcon className="mr-2 h-4 w-4" />
            {merchant.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MerchantSelector;
