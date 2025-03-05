import { Button } from "@egaranti/components";

import React from "react";

import PersonnelAssignment from "./personnelAssignment";

import { Calendar, X } from "lucide-react";

const RequestDetailHeader = ({
  request,
  isEditing,
  setIsEditing,
  saving,
  onClose,
  personnel,
  loadingPersonnel,
  assigningPersonnel,
  handleAssignPersonnel,
  formRef,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between border-b bg-gray-50 p-4">
      <div className="flex-1">
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-700">
          {request.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{request?.createdAt}</span>
            </div>
          )}
          <div className="bg-white">
            <PersonnelAssignment
              personnel={personnel}
              selectedPersonnel={request.technicalPersonal}
              onAssign={handleAssignPersonnel}
              isLoading={loadingPersonnel || assigningPersonnel}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isEditing ? (
          <>
            <Button
              variant="default"
              onClick={() => setIsEditing(true)}
              className="h-9"
            >
              Düzenle
            </Button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg bg-white p-2 transition-colors hover:bg-gray-200"
              aria-label="Close details"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="secondaryColor"
              onClick={() => setIsEditing(false)}
            >
              İptal
            </Button>
            <Button
              size="sm"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={saving}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestDetailHeader;
