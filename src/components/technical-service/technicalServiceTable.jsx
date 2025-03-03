import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@egaranti/components";

import React, { useState } from "react";

import { useTechnicalServiceStore } from "@/stores/useTechnicalServiceStore";

import { Trash2 } from "lucide-react";

const TechnicalServiceTable = ({ users }) => {
  const { deleteUser } = useTechnicalServiceStore();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const handleDelete = async () => {
    if (deleteDialog.user) {
      await deleteUser(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
    }
  };

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead>Telefon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>

              <TableCell>{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teknik Servisi Sil</DialogTitle>
            <DialogDescription>
              {deleteDialog.user?.fullName} isimli teknik servisi silmek
              istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondaryGray"
              onClick={() => setDeleteDialog({ open: false, user: null })}
            >
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicalServiceTable;
