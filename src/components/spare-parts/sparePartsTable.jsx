import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@egaranti/components";

import React from "react";

const SparePartsTable = ({ spareParts, onEdit }) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parça Adı</TableHead>
            <TableHead>Stok Adedi</TableHead>
            {/* <TableHead className="w-[100px]">İşlemler</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {spareParts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Gösterilecek veri bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            spareParts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>{part.name}</TableCell>
                <TableCell>{part.stock}</TableCell>
                {/* <TableCell>
                  <Button
                    variant="secondaryColor"
                    size="icon"
                    onClick={() => onEdit(part)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SparePartsTable;
