import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@egaranti/components";

import { useEffect, useState } from "react";

import customerService from "@/services/customerService";

import { MailIcon, PhoneIcon, UserIcon } from "lucide-react";

const CustomerSearch = ({ onCustomerSelect }) => {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchCustomers = async () => {
      if (query.length < 3) return;

      setLoading(true);
      try {
        const results = await customerService.searchByPhone(query);
        setCustomers(results);
      } catch (error) {
        console.error("Error searching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCustomers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Command className="rounded-lg border shadow-sm">
      <CommandInput
        placeholder="Müşteri telefon numarası ile arayın..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!loading && customers.length === 0 && query.length == 10 && (
          <CommandEmpty>
            Müşteri bulunamadı. Yeni müşteri olarak devam edilecek.
          </CommandEmpty>
        )}

        {customers.length > 0 && (
          <CommandGroup>
            {customers.map((customer) => (
              <CommandItem
                key={customer.id}
                onSelect={() => onCustomerSelect(customer)}
                className="flex flex-col items-start gap-1 p-2"
              >
                <div className="flex w-full items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="font-medium">{customer.name}</span>
                </div>
                <div className="flex w-full items-center gap-2 text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex w-full items-center gap-2 text-sm text-gray-500">
                    <MailIcon className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default CustomerSearch;
