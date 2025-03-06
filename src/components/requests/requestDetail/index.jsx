import React, { useEffect, useState } from "react";

// Import extracted components from barrel export
import {
  ErrorDisplay,
  LoadingSkeleton,
  RequestDetailContent,
  RequestDetailHeader,
} from "./components";

import requestService from "@/services/requestService";
import technicalService from "@/services/technicalService";
import userService from "@/services/userService";

import useRequestStore from "@/stores/useRequestStore";

import FollowUpFormDialog from "@/components/forms/followUpFormDialog";

import { motion } from "framer-motion";

const RequestDetail = ({ request: initialRequest, onClose }) => {
  const formRef = React.useRef(null);
  const [request, setRequest] = useState(initialRequest);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const [loadingPersonnel, setLoadingPersonnel] = useState(false);
  const [assigningPersonnel, setAssigningPersonnel] = useState(false);
  const [assigningTechnicalService, setAssigningTechnicalService] =
    useState(false);
  const [loadingTechnicalService, setLoadingTechnicalService] = useState(false);
  const { loading, errors, fetchRequestById, clearErrors, updateDemandData } =
    useRequestStore();
  const [technicalServices, setTechnicalServices] = useState([]);

  const fetchPersonnel = async () => {
    setLoadingPersonnel(true);
    try {
      const data = await userService.getUsers();
      setPersonnel(data);
    } catch (error) {
      console.error("Error fetching personnel:", error);
    } finally {
      setLoadingPersonnel(false);
    }
  };

  const fetchTechnicalServices = async () => {
    setLoadingTechnicalService(true);
    try {
      const data = await technicalService.getUsers();
      setTechnicalServices(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching technical services:", error);
    } finally {
      setLoadingTechnicalService(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
    fetchTechnicalServices();
  }, []);

  const handleAssignPersonnel = async (personnelId) => {
    if (!personnelId) return;

    setAssigningPersonnel(true);
    try {
      await requestService.assignPersonnel(request.id, personnelId);
      await refreshRequestData();
    } catch (error) {
      console.error("Error assigning personnel:", error);
    } finally {
      setAssigningPersonnel(false);
    }
  };

  const handleAssignTechnicalService = async (technicalServiceId) => {
    if (!technicalServiceId) return;

    setAssigningTechnicalService(true);
    try {
      await requestService.assignTechnicalService(
        request.id,
        technicalServiceId,
      );
      await refreshRequestData();
    } catch (error) {
      console.error("Error assigning technical service:", error);
    } finally {
      setAssigningTechnicalService(false);
    }
  };

  const refreshRequestData = async () => {
    try {
      const data = await fetchRequestById(request.id);
      setRequest(data);
    } catch (error) {
      // Error is handled by the store
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        const data = await fetchRequestById(initialRequest.id);
        if (isMounted) {
          setRequest(data);
        }
      } catch (error) {
        // Error is handled by the store
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
      clearErrors();
    };
  }, [initialRequest.id, fetchRequestById, clearErrors]);

  const handleRetry = () => {
    clearErrors();
    fetchRequestById(initialRequest.id);
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const updatedDemandData = request.demandData.map((field) => ({
        ...field,
        sparePartsValue:
          field.type === "SPARE_PART" ? values[field.label] : null,
        value: field.type === "SPARE_PART" ? null : values[field.label],
      }));

      const updatedRequest = await updateDemandData(request.id, {
        ...request,
        demandData: updatedDemandData,
      });

      setRequest(updatedRequest);
      setIsEditing(false);
      // Refresh the request data to ensure we have the latest version
      await refreshRequestData();
    } catch (error) {
      console.error("Error updating demand data:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitFollowUp = async (values) => {
    setSaving(true);
    try {
      const updatedData = {
        ...request,
        followupDemandData: values,
      };
      const updatedRequest = await updateDemandData(request.id, updatedData);
      setRequest(updatedRequest);
      // Refresh the request data to ensure we have the latest version
      await refreshRequestData();
    } catch (error) {
      console.error("Error updating follow-up data:", error);
    } finally {
      setSaving(false);
      setFollowUpDialogOpen(false);
    }
  };

  if (loading.requestDetail) {
    return <LoadingSkeleton />;
  }

  if (errors.requestDetail) {
    return <ErrorDisplay error={errors.requestDetail} onRetry={handleRetry} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <div className="flex h-full flex-col">
          {/* Header Section */}
          <RequestDetailHeader
            request={request}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            saving={saving}
            onClose={onClose}
            personnel={personnel}
            loadingPersonnel={loadingPersonnel}
            assigningPersonnel={assigningPersonnel}
            handleAssignPersonnel={handleAssignPersonnel}
            formRef={formRef}
            onRequestUpdate={refreshRequestData}
            handleAssignTechnicalService={handleAssignTechnicalService}
            loadingTechnicalService={loadingTechnicalService}
            assigningTechnicalService={assigningTechnicalService}
            technicalServices={technicalServices}
          />

          {/* Content Section */}
          <RequestDetailContent
            request={request}
            isEditing={isEditing}
            formRef={formRef}
            handleSubmit={handleSubmit}
            setFollowUpDialogOpen={setFollowUpDialogOpen}
          />
        </div>
      </motion.div>
      {request.followupDemandData && (
        <FollowUpFormDialog
          open={followUpDialogOpen}
          onOpenChange={setFollowUpDialogOpen}
          followUpFields={request.followupDemandData}
          onSubmit={handleSubmitFollowUp}
          defaultValues={request.followupDemandData}
        />
      )}
    </div>
  );
};

export default RequestDetail;
