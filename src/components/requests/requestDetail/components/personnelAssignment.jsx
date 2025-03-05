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

import { Check, ChevronsUpDown, UserCheck, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

const PersonnelAssignment = ({
  personnel,
  onAssign,
  isLoading,
  selectedPersonnel,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate initials for avatar
  const getInitials = (name, surname) => {
    if (!name && !surname) return "?";
    return `${name?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-300";

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-teal-500",
    ];

    // Simple hash function to get consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

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
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white",
                    getAvatarColor(
                      `${selectedPersonnel?.name} ${selectedPersonnel?.surname}`,
                    ),
                  )}
                >
                  {getInitials(
                    selectedPersonnel?.name,
                    selectedPersonnel?.surname,
                  )}
                </div>
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
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white",
                      getAvatarColor(`${person.name} ${person.surname}`),
                    )}
                  >
                    {getInitials(person.name, person.surname)}
                  </div>
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
