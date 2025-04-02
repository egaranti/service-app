import { Button } from "@egaranti/components";
import { useToast } from "@egaranti/components";

import React, { useState } from "react";

import PersonnelAssignment from "./personnelAssignment";
import StatusSelect from "./statusSelect";
import TechnicalSerivceAssignment from "./technicalSerivceAssignment";

import requestService from "@/services/requestService";

import { Calendar, X } from "lucide-react";

const RequestDetailHeader = ({
  request,
  personnel,
  loadingPersonnel,
  assigningPersonnel,
  handleAssignPersonnel,
  onRequestUpdate,
  handleAssignTechnicalService,
  loadingTechnicalService,
  assigningTechnicalService,
  technicalServices,
  onClose,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await requestService.updateRequestStatus({
        id: request.id,
        status: newStatus,
      });
      onRequestUpdate?.();
      toast({
        variant: "success",
        title: "Durum değiştirildi",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "error",
        title: "Durum değiştirilemedi",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b p-4 py-2">
      <div className="mt-2 flex w-full items-center justify-between gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-4">
          <div className="bg-white">
            <PersonnelAssignment
              personnel={personnel}
              selectedPersonnel={request.technicalPersonal}
              onAssign={handleAssignPersonnel}
              isLoading={loadingPersonnel || assigningPersonnel}
            />
          </div>
          {localStorage.getItem("user") === "panel" && (
            <div className="bg-white">
              <TechnicalSerivceAssignment
                technicalServices={technicalServices}
                selectedTechnicalService={request.technicalService}
                onAssign={handleAssignTechnicalService}
                isLoading={loadingTechnicalService || assigningTechnicalService}
              />
            </div>
          )}
          <div className="bg-white">
            <StatusSelect
              value={request.status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
            />
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-lg bg-white p-2 transition-colors hover:bg-gray-200"
          aria-label="Close details"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default RequestDetailHeader;
