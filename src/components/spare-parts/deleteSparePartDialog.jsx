import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@egaranti/components";

import React from "react";

const DeleteSparePartDialog = ({ open, onOpenChange, onConfirm, part }) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Yedek Parçayı Sil</AlertDialogTitle>
          <AlertDialogDescription>
            "{part?.name}" adlı yedek parçayı silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm}>
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSparePartDialog;
