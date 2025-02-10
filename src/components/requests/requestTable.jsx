import { Tag } from "@egaranti/components";

import React from "react";
import { useNavigate } from "react-router-dom";

import DynamicTable from "./dynamicTable";

import { format } from "date-fns";

const RequestTable = ({ data, filterDefinitions }) => {
  const navigate = useNavigate();

  const getStatusTagVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      case "completed":
        return "success";
      default:
        return "secondary";
    }
  };

  const getPriorityTagVariant = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Dynamically generate columns based on filterDefinitions
  const generateColumns = () => {
    const baseColumns = filterDefinitions.map((filter) => ({
      key: filter.key,
      label: filter.label,
      render: (value, row) => {
        if (filter.key === "status") {
          return (
            <Tag variant={getStatusTagVariant(value)}>
              {filter.options?.find((opt) => opt.value === value)?.label ||
                value}
            </Tag>
          );
        }
        if (filter.key === "priority") {
          return (
            <Tag variant={getPriorityTagVariant(value)}>
              {filter.options?.find((opt) => opt.value === value)?.label ||
                value}
            </Tag>
          );
        }
        if (filter.type === "date" && value) {
          return format(new Date(value), "dd.MM.yyyy");
        }
        return value;
      },
    }));

    // Add description column if not included in filterDefinitions
    if (!filterDefinitions.find((f) => f.key === "description")) {
      baseColumns.push({
        key: "description",
        label: "Açıklama",
        render: (value) => <div className="max-w-md truncate">{value}</div>,
      });
    }

    return baseColumns;
  };

  const handleRowClick = (row) => {
    navigate(`/requests/${row.id}`);
  };

  return (
    <div className="rounded-lg border bg-white">
      <DynamicTable
        columns={generateColumns()}
        data={data}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default RequestTable;
