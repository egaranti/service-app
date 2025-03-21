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

import { Edit, Trash } from "lucide-react";

const SparePartsTable = ({ spareParts, onEdit, onDelete }) => {
  if (!spareParts || spareParts.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Bu ürüne ait yedek parça kaydı bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parça Adı</TableHead>
            <TableHead className="text-right">Stok</TableHead>
            <TableHead className="text-right">Fiyat</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spareParts.map((part) => (
            <TableRow key={part.id}>
              <TableCell className="font-medium">{part.name}</TableCell>
              <TableCell className="text-right">{part.stock} adet</TableCell>
              <TableCell className="text-right">{part.price} ₺</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    aria-label="Edit"
                    className="p-2"
                    variant="secondaryGray"
                    size="icon"
                    onClick={() => onEdit(part)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    aria-label="Delete"
                    className="p-2"
                    variant="secondaryGray"
                    size="icon"
                    onClick={() => onDelete(part)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SparePartsTable;
