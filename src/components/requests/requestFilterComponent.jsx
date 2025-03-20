import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useEffect } from "react";

import useRequestStore from "@/stores/useRequestStore";

import { FilterIcon } from "lucide-react";

const RequestFilterComponent = () => {
  const {
    statusDefinitions,
    filters,
    setFilters,
    loading,
    fetchStatusDefinitions,
  } = useRequestStore();

  useEffect(() => {
    fetchStatusDefinitions();
  }, [fetchStatusDefinitions]);

  const onChangeStatus = (value) => {
    setFilters({ ...filters, status: value });
  };

  const titleMap = {
    SERVICE: "Servis Talebi",
    SETUP: "Kurulum Talebi",
  };

  const onChangeTypeOfDemand = (value) => {
    setFilters({ ...filters, title: value });
  };

  const activeFiltersCount = [filters.status, filters.title].filter(
    Boolean,
  ).length;

  return (
    <div className="mb-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondaryGray"
            size="sm"
            className="h-9 border-dashed"
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            Filtreler
            {activeFiltersCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] bg-white p-4" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Durum</Label>
              <Select value={filters.status} onValueChange={onChangeStatus}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Tümü</SelectItem>
                  {statusDefinitions?.map((definition) => (
                    <SelectItem
                      key={definition.status}
                      value={definition.status}
                    >
                      {definition.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Talep Türü</Label>
              <Select
                value={filters.title}
                onValueChange={onChangeTypeOfDemand}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Tümü</SelectItem>
                  {Object.keys(titleMap).map((title) => (
                    <SelectItem key={title} value={title}>
                      {titleMap[title]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RequestFilterComponent;
