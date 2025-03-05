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

import Avatar from "@/components/ui/avatar";

import { Check, ChevronsUpDown, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

const PersonnelAssignment = ({
  personnel,
  onAssign,
  isLoading,
  selectedPersonnel,
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
            !selectedPersonnel?.id && "text-gray-500",
          )}
        >
          <div className="flex items-center gap-2">
            {!selectedPersonnel?.id ? (
              <>
                <UserPlus className="h-4 w-4 text-gray-500" />
                <span>Atama Yapın</span>
              </>
            ) : (
              <>
                <Avatar
                  name={selectedPersonnel?.name}
                  surname={selectedPersonnel?.surname}
                  size="sm"
                />

                <div className="flex flex-col">
                  <span className="font-medium">
                    {selectedPersonnel?.name} {selectedPersonnel?.surname}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedPersonnel?.technicalServiceName}
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
            {personnel.map((person) => (
              <CommandItem
                key={person.id}
                value={person.id}
                onSelect={() => {
                  onAssign(person.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between py-2",
                  selectedPersonnel?.id === person.id ? "bg-blue-100" : "",
                )}
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    name={person.name}
                    surname={person.surname}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {person.name} {person.surname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {person.technicalServiceName}
                    </span>
                  </div>
                </div>
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    selectedPersonnel?.id === person.id
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

export default PersonnelAssignment;
