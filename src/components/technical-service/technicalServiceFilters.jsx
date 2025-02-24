import { Input } from "@egaranti/components";

import React from "react";

import { Search } from "lucide-react";

const TechnicalServiceFilters = ({ filters, setFilters }) => {
  return (
    <div className="mb-6 flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
        <Input
          placeholder="İsim veya telefon numarası ile ara..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs pl-9"
        />
      </div>
    </div>
  );
};

export default TechnicalServiceFilters;
