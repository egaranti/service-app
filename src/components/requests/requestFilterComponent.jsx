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

import { useState } from "react";

import useRequestStore from "@/stores/useRequestStore";
import { useTechnicalServiceStore } from "@/stores/useTechnicalServiceStore";

import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FilterIcon } from "lucide-react";

const RequestFilterComponent = () => {
  const {
    statusDefinitions,
    filters,
    setFilters,
    fetchStatusDefinitions,
    resetFilter,
  } = useRequestStore();

  const { users, fetchUsers } = useTechnicalServiceStore();
  
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTechServiceOpen, setIsTechServiceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingTechServices, setLoadingTechServices] = useState(false);

  const handleStatusOpenChange = (open) => {
    setIsStatusOpen(open);
    if (open && statusDefinitions?.length === 0 && !loadingStatus) {
      setLoadingStatus(true);
      fetchStatusDefinitions().finally(() => setLoadingStatus(false));
    }
  };

  const handleTechServiceOpenChange = (open) => {
    setIsTechServiceOpen(open);
    if (open && users?.length === 0 && !loadingTechServices) {
      setLoadingTechServices(true);
      fetchUsers().finally(() => setLoadingTechServices(false));
    }
  };

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

  const onChangeTechnician = (value) => {
    setFilters({ ...filters, technicalServiceId: value });
  };

  const onDateRangeChange = (dateRange) => {
    setFilters({
      ...filters,
      fromDate: dateRange?.from || null,
      toDate: dateRange?.to || null,
    });
  };

  const activeFiltersCount = [
    filters.status,
    filters.title,
    filters.technicalServiceId,
    filters.fromDate,
    filters.toDate,
  ].filter(Boolean).length;

  return (
    <div className="mb-2 flex items-center gap-2">
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
              <Select 
                value={filters.status} 
                onValueChange={onChangeStatus}
                open={isStatusOpen}
                onOpenChange={handleStatusOpenChange}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {loadingStatus ? (
                    <div className="flex items-center justify-center p-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      <SelectItem value={null}>Tümü</SelectItem>
                      {statusDefinitions?.map((definition) => (
                        <SelectItem
                          key={definition.status}
                          value={definition.status}
                        >
                          {definition.status}
                        </SelectItem>
                      ))}
                    </>
                  )}
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
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Yetkili Servis</Label>
              <Select
                value={filters.technicalServiceId}
                onValueChange={onChangeTechnician}
                open={isTechServiceOpen}
                onOpenChange={handleTechServiceOpenChange}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTechServices ? (
                    <div className="flex items-center justify-center p-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      <SelectItem value={null}>Tümü</SelectItem>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm text-gray-600">Tarih</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondaryGray"
                    className="w-full justify-start text-left md:w-auto"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fromDate && filters.toDate
                      ? `${format(new Date(filters.fromDate), "d MMM yyyy", { locale: tr })} - ${format(new Date(filters.toDate), "d MMM yyyy", { locale: tr })}`
                      : "Tarih Aralığı Seçiniz"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <Calendar
                    initialFocus
                    captionLayout="dropdown-years"
                    mode="range"
                    defaultMonth={new Date()}
                    selected={{
                      from: filters.fromDate
                        ? new Date(filters.fromDate)
                        : undefined,
                      to: filters.toDate ? new Date(filters.toDate) : undefined,
                    }}
                    onSelect={onDateRangeChange}
                    numberOfMonths={1}
                    locale={tr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {activeFiltersCount > 0 && (
        <Button
          variant="secondaryGray"
          size="sm"
          className="h-9 border-dashed"
          onClick={resetFilter}
        >
          Filtreleri Sıfırla
        </Button>
      )}
    </div>
  );
};

export default RequestFilterComponent;
