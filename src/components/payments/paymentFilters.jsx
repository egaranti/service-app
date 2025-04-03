import {
  Button,
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

import { useTechnicalServiceStore } from "@/stores/useTechnicalServiceStore";

import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const PaymentFilters = ({
  selectedProvider,
  onProviderChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}) => {
  const { users: providers, fetchUsers } = useTechnicalServiceStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border bg-white p-4">
      <Select
        value={selectedProvider || "all"}
        onValueChange={(value) =>
          onProviderChange(value === "all" ? null : value)
        }
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Teknik Servis Seçiniz" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondaryGray"
            className="w-full justify-start text-left md:w-auto"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from && dateRange?.to
              ? `${format(new Date(dateRange.from), "d MMM yyyy", { locale: tr })} - ${format(new Date(dateRange.to), "d MMM yyyy", { locale: tr })}`
              : "Tarih Aralığı Seçiniz"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white p-0" align="start">
          <Calendar
            initialFocus
            captionLayout="dropdown-years"
            mode="range"
            defaultMonth={new Date()}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={1}
            locale={tr}
          />
        </PopoverContent>
      </Popover>
      <div className="ml-auto flex items-center gap-2">
        {(selectedProvider || (dateRange && dateRange.from)) && (
          <Button variant="secondaryColor" size="sm" onClick={onClearFilters}>
            Filtreleri Temizle
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentFilters;
