import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

import useRequestStore from "@/stores/useRequestStore";

import { ChevronDown, X } from "lucide-react";

const FilterItem = ({ filter, value, onChange, onRemove }) => {
  if (filter.type === "date") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="date"
          placeholder={filter.label}
          value={value || ""}
          onChange={(e) => onChange(filter.key, e.target.value)}
          className="h-9"
        />
        <button
          onClick={() => onRemove(filter.key)}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label={`Remove ${filter.label} filter`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (filter.type === "text") {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder={filter.label}
          value={value || ""}
          onChange={(e) => onChange(filter.key, e.target.value)}
          className="h-9"
        />
        <button
          onClick={() => onRemove(filter.key)}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label={`Remove ${filter.label} filter`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (filter.type === "select") {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={value || ""}
          onValueChange={(newValue) => onChange(filter.key, newValue)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={() => onRemove(filter.key)}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label={`Remove ${filter.label} filter`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return null;
};

const RequestFilterComponent = () => {
  const {
    filterDefinitions,
    filters,
    setFilters,
    loading,
    errors,
    clearErrors,
    fetchFilterDefinitions,
  } = useRequestStore();

  const [activeFilters, setActiveFilters] = useState({});
  const [availableFilters, setAvailableFilters] = useState([]);

  useEffect(() => {
    if (!loading.filterDefinitions && filterDefinitions.length > 0) {
      // Initialize active filters from URL/store filters
      const initialFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (key !== "page" && key !== "size" && key !== "totalPage" && value) {
          initialFilters[key] = value;
        }
      });
      setActiveFilters(initialFilters);

      // Set available filters
      setAvailableFilters(
        filterDefinitions.filter((filter) => !initialFilters[filter.key]),
      );
    }
  }, [filterDefinitions, filters, loading.filterDefinitions]);

  const handleAddFilter = (filter) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter.key]: "",
    }));
    setAvailableFilters((prev) => prev.filter((f) => f.key !== filter.key));
  };

  const handleRemoveFilter = (key) => {
    const filterDef = filterDefinitions.find((f) => f.key === key);
    if (filterDef) {
      setAvailableFilters((prev) => [...prev, filterDef]);
    }

    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });

    // Update store filters with empty value to trigger removal
    setFilters({
      ...filters,
      [key]: "",
    });
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update store filters
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleClearAll = () => {
    setActiveFilters({});
    setAvailableFilters(filterDefinitions);

    // Create an object with all current filter keys set to null
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      // Preserve pagination-related fields
      if (key === "size") {
        acc[key] = filters.size;
      } else if (key === "totalPage") {
        acc[key] = filters.totalPage;
      } else {
        acc[key] = null;
      }
      return acc;
    }, {});

    // Reset page to 0 and apply cleared filters
    setFilters({
      ...clearedFilters,
      page: 0,
    });
  };

  if (loading.filterDefinitions) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (errors.filterDefinitions) {
    return (
      <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{errors.filterDefinitions}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearErrors();
            fetchFilterDefinitions();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondaryColor"
                disabled={availableFilters.length === 0}
              >
                Filtre Ekle
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white">
              {availableFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handleAddFilter(filter)}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {Object.keys(activeFilters).length > 0 && (
            <button
              className="h-9 text-sm text-gray-500 hover:text-gray-700"
              onClick={handleClearAll}
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {Object.keys(activeFilters).length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(activeFilters).map(([key]) => {
            const filterDef = filterDefinitions.find((f) => f.key === key);
            if (!filterDef) return null;

            return (
              <FilterItem
                key={key}
                filter={filterDef}
                value={activeFilters[key]}
                onChange={handleFilterChange}
                onRemove={handleRemoveFilter}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestFilterComponent;
