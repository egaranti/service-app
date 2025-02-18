import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import React from "react";

import { Search } from "lucide-react";

const departments = [
  { value: "it", label: "IT" },
  { value: "hr", label: "İK" },
  { value: "finance", label: "Finans" },
  { value: "sales", label: "Satış" },
];

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "Kullanıcı" },
  { value: "manager", label: "Yönetici" },
];

const UserFilters = ({ filters, setFilters }) => {
  return (
    <div className="mb-6 flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
        <Input
          placeholder="İsim veya email ile ara..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default UserFilters;
