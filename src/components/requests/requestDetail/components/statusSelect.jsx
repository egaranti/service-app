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

import React, { useEffect, useState } from "react";

import requestService from "@/services/requestService";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

const StatusSelect = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await requestService.getFilterDefinitions();
        setStatuses(response);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (loading) {
    return (
      <div className="h-9 w-[180px] animate-pulse rounded-md bg-gray-100" />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-haspopup="listbox"
          variant="secondaryColor"
          aria-expanded={open}
          className="justify-between border border-blue-500 shadow-none"
        >
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
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
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelect;
