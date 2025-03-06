import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@egaranti/components";

import React, { useState } from "react";

import Avatar from "@/components/ui/avatar";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

const TechnicalSerivceAssignment = ({
  technicalServices,
  onAssign,
  isLoading,
  selectedTechnicalService,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={isLoading}
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            !selectedTechnicalService?.id && "text-gray-500",
          )}
        >
          <div className="flex items-center gap-2">
            {!selectedTechnicalService?.id ? (
              <>
                {/* <UserPlus className="h-4 w-4 text-gray-500" /> */}
                <span>Teknik Servis</span>
              </>
            ) : (
              <>
                <Avatar name={selectedTechnicalService?.name} size="sm" />

                <div className="flex flex-col">
                  <span className="font-medium">
                    {selectedTechnicalService?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedTechnicalService?.name}
                  </span>
                </div>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] bg-white p-0">
        <Command>
          <CommandEmpty>Personel bulunamadı.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {technicalServices?.map((technicalService) => (
              <CommandItem
                key={technicalService.id}
                value={technicalService.id}
                onSelect={() => {
                  onAssign(technicalService.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between py-2",
                  selectedTechnicalService?.id === technicalService.id
                    ? "bg-blue-100"
                    : "",
                )}
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    name={technicalService.name}
                    surname={technicalService.surname}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {technicalService.name} {technicalService.surname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {technicalService.technicalServiceName}
                    </span>
                  </div>
                </div>
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    selectedTechnicalService?.id === technicalService.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TechnicalSerivceAssignment;
