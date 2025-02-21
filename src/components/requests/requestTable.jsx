import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Tag,
} from "@egaranti/components";
import { TableHead } from "@egaranti/components";

import React from "react";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";

const RequestTable = ({ data, filterDefinitions }) => {
  const navigate = useNavigate();

  // Dynamically generate columns based on filterDefinitions
  // const generateColumns = () => {
  //   const baseColumns = filterDefinitions.map((filter) => ({
  //     key: filter.key,
  //     label: filter.label,
  //     render: (value, row) => {
  //       if (filter.key === "STATUS") {
  //         return (
  //           <Tag variant={getStatusTagVariant(value)}>
  //             {filter.options?.find((opt) => opt.value === value)?.label ||
  //               value}
  //           </Tag>
  //         );
  //       }
  //       if (filter.key === "PRIORITY") {
  //         return (
  //           <Tag variant={getPriorityTagVariant(value)}>
  //             {filter.options?.find((opt) => opt.value === value)?.label ||
  //               value}
  //           </Tag>
  //         );
  //       }
  //       if (filter.type === "DATE" && value) {
  //         return format(new Date(value), "dd.MM.yyyy");
  //       }
  //       return value;
  //     },
  //   }));

  //   // Add description column if not included in filterDefinitions
  //   if (!filterDefinitions.find((f) => f.key === "description")) {
  //     baseColumns.push({
  //       key: "description",
  //       label: "Açıklama",
  //       render: (value) => <div className="max-w-md truncate">{value}</div>,
  //     });
  //   }

  //   return baseColumns;
  // };

  const handleRowClick = (row) => {
    navigate(`/requests/${row.id}`);
  };

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Güncellenme Tarihi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <TableRow
              className="cursor-pointer"
              key={rowIndex}
              onClick={() => handleRowClick(row)}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <Tag size="sm">{row.status}</Tag>
              </TableCell>
              <TableCell>
                {format(new Date(row.updatedAt), "dd.MM.yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestTable;
