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
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const titleMap = {
    SERVICE: "Servis Talebi",
    SETUP: "Kurulum Talebi",
  };

  const onChangeTypeOfDemand = (value) => {
    setFilters((prev) => ({ ...prev, title: value }));
  };

  return (
    <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
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
                <SelectItem key={definition} value={definition}>
                  {definition}
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
