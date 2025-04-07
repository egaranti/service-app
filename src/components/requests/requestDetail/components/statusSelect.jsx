import { Button } from "@egaranti/components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@egaranti/components";

import React, { useState } from "react";

import requestService from "@/services/requestService";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

const StatusSelect = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatuses = async () => {
    if (statuses.length > 0) return; // Don't fetch if we already have data
    
    try {
      setLoading(true);
      const response = await requestService.getFilterDefinitions();
      setStatuses(response);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load statuses only when dropdown is opened
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchStatuses();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-haspopup="listbox"
          variant="secondaryColor"
          aria-expanded={open}
          className="justify-between border border-blue-500 shadow-none"
          disabled={disabled}
        >
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          {loading ? (
            <div className="flex items-center justify-center p-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <CommandEmpty>Durum bulunamadı.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status}
                    value={status.status}
                    onSelect={() => {
                      onChange(status.status);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === status.status ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {status.status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelect;
