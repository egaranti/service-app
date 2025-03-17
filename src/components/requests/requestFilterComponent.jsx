import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useEffect } from "react";

import useRequestStore from "@/stores/useRequestStore";

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

  return (
    <div className="mb-2 space-y-4 rounded-md rounded-b-none border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Durum</Label>
          <Select value={filters.status} onValueChange={onChangeStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duruma göre filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Tümü</SelectItem>
              {statusDefinitions?.map((definition) => (
                <SelectItem key={definition.status} value={definition.status}>
                  {definition.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Talep Türü</Label>
          <Select value={filters.title} onValueChange={onChangeTypeOfDemand}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Talep Türüne göre filtrele" />
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
    </div>
  );
};

export default RequestFilterComponent;
