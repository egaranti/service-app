import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@egaranti/components";

import { Search } from "lucide-react";

export default function RequestFilters({
  filters,
  setFilters,
  filterDefinitions,
}) {
  const renderFilter = (filter) => {
    switch (filter.type) {
      case "text":
        return (
          <div key={filter.key} className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-[19px] h-4 w-4 text-[#717680]" />
            <Input
              placeholder={filter.placeholder}
              value={filters[filter.key] || ""}
              onChange={(e) => setFilters({ [filter.key]: e.target.value })}
              className="pl-9"
            />
          </div>
        );

      case "select":
        return (
          <div key={filter.key} className="min-w-[200px] flex-1">
            <Select
              value={filters[filter.key] || ""}
              onValueChange={(value) => setFilters({ [filter.key]: value })}
            >
              <SelectTrigger placeholder={filter.label} />
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
