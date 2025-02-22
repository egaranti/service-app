import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";

import React from "react";

const RequestFilterComponent = ({
  filterDefinitions,
  filters,
  onFilterChange,
}) => {
  const [selectedFilters, setSelectedFilters] = React.useState({});

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      const newFilters = {
        ...prev,
        [filterKey]: newValues,
      };

      // Clean up empty arrays
      if (newValues.length === 0) {
        delete newFilters[filterKey];
      }

      // Notify parent with filter changes
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleReset = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  const renderFilterButton = (definition) => {
    const selectedCount = selectedFilters[definition.key]?.length || 0;

    return (
      <div key={definition.key} className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              + {definition.label} {selectedCount > 0 && `(${selectedCount})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {definition.options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange(definition.key, option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedFilters[definition.key]?.map((value) => {
          const option = definition.options.find((opt) => opt.value === value);
          return (
            <span
              key={value}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {option?.label || value}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {filterDefinitions?.map(renderFilterButton)}

      {Object.keys(selectedFilters).length > 0 && (
        <Button
          onClick={handleReset}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
        >
          Reset ×
        </Button>
      )}
    </div>
  );
};

export default RequestFilterComponent;
