import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { Search } from "lucide-react";

export default function FormFilters({
  filterDefinitions,
  filters,
  setFilters,
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {filterDefinitions.map((filter) => {
        if (filter.type === "text") {
          return (
            <div key={filter.key} className="min-w-[200px] flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-[10px] h-4 w-4 text-[#717680]" />
                <Input
                  placeholder={filter.placeholder}
                  className="pl-9"
                  value={filters[filter.key] || ""}
                  onChange={(e) => setFilters({ [filter.key]: e.target.value })}
                />
              </div>
            </div>
          );
        }
        if (filter.type === "DROPDOWN") {
          return (
            <div key={filter.key} className="min-w-[200px] flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              <Select
                value={filters[filter.key] || ""}
                onValueChange={(value) => setFilters({ [filter.key]: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Tümü</SelectItem>
                  {filter.options?.map((option) => (
                    <SelectItem
                      key={typeof option === "object" ? option.value : option}
                      value={typeof option === "object" ? option.value : option}
                    >
                      {typeof option === "object" ? option.label : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
