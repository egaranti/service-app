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
