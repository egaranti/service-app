import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Input,
} from "@egaranti/components";

import { ChevronsUpDown } from "lucide-react";

export default function RequestFilters({
  filters,
  setFilters,
  filterDefinitions,
}) {
  const renderFilter = (filter) => {
    switch (filter.type) {
      case "text":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <Input
              placeholder={filter.placeholder}
              value={filters[filter.key] || ""}
              onChange={(e) => setFilters({ [filter.key]: e.target.value })}
            />
          </div>
        );

      case "select":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full">
                <Button
                  variant="secondaryGray"
                  className="w-full justify-between"
                >
                  {filters[filter.key] || filter.label || "Select an option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuRadioGroup
                  value={filters[filter.key]}
                  onValueChange={(value) => setFilters({ [filter.key]: value })}
                >
                  <DropdownMenuRadioItem
                    key="all"
                    value={null}
                    onSelect={() => setFilters({ [filter.key]: null })}
                  >
                    Tümü
                  </DropdownMenuRadioItem>
                  {filter.options?.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      onSelect={() =>
                        setFilters({ [filter.key]: option.value })
                      }
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      case "date":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <Input
              type="date"
              placeholder={filter.placeholder}
              value={filters[filter.key] || ""}
              onChange={(e) => setFilters({ [filter.key]: e.target.value })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {filterDefinitions?.map(renderFilter)}
    </div>
  );
}
