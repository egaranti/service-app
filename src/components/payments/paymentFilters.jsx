import { Button } from "@egaranti/components";
import { Calendar } from "@egaranti/components";
import { Popover, PopoverContent, PopoverTrigger } from "@egaranti/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const PaymentFilters = ({
  providers,
  selectedProvider,
  onProviderChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}) => {
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    return "Tarih Aralığı Seçiniz";
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        {/* <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All providers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All providers</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondaryGray"
            className="w-full justify-start text-left md:w-auto"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white p-0" align="start">
          <Calendar
            initialFocus
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
        {(selectedProvider || dateRange.from) && (
          <Button variant="secondaryColor" size="sm" onClick={onClearFilters}>
            Filtreleri Temizle
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentFilters;
