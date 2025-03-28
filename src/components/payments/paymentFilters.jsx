import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useEffect, useState } from "react";

import technicalService from "@/services/technicalService";

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
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const users = await technicalService.getUsers();
        setProviders(users);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      }
    };
    fetchProviders();
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
