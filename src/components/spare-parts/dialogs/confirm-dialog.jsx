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

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
