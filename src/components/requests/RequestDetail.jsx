import { Button } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import useRequestStore from "@/stores/useRequestStore";

import DynamicForm from "@/components/forms/dynamicForm";
import FollowUpFormDialog from "@/components/forms/followUpFormDialog";

import { motion } from "framer-motion";
import { Calendar, ExternalLinkIcon, X } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="h-full space-y-6 p-6">
    <div className="space-y-2">
      <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
    </div>
    <div className="h-32 w-full animate-pulse rounded bg-gray-200"></div>
    <div className="h-24 w-full animate-pulse rounded bg-gray-200"></div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex h-full flex-col items-center justify-center p-6">
    <p className="mb-4 text-red-600">{error}</p>
    <Button onClick={onRetry} variant="secondaryGray">
      Retry
    </Button>
  </div>
);

const FollowUpDataPreview = ({
  followupData,
  request,
  setFollowUpDialogOpen,
}) => {
  if (!followupData || followupData.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">İşlem Bilgileri</h3>
        {request.followupDemandData && (
          <button
            onClick={() => setFollowUpDialogOpen(true)}
            className="h-9 text-sm font-medium text-blue-600 hover:underline"
          >
            İşlem Ekle
          </button>
        )}
      </div>
      <div className="space-y-2">
        {followupData.map((field, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {field.label}
            </span>
            <span className="text-sm text-gray-600">
              {field.value ? (
                Array.isArray(field.value) ? (
                  field.value.join(", ")
                ) : (
                  field.value.toString()
                )
              ) : (
                <span className="text-gray-400">Belirtilmemiş</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RequestDetail = ({ request: initialRequest, onClose }) => {
  const formRef = React.useRef(null);
  const [request, setRequest] = useState(initialRequest);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const { loading, errors, fetchRequestById, clearErrors, updateDemandData } =
    useRequestStore();

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
      const updatedDemandData = request.demandData.map((field) => {
        const fieldValue = values[field.label];
        return {
          ...field,
          sparePartsValue: field.type === "SPARE_PART" ? fieldValue : null,
          value: field.type !== "SPARE_PART" ? fieldValue : null,
        };
      });
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
          <div className="mb-6 flex items-center justify-between border-b bg-gray-50 p-4">
            <div className="flex-1">
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                {request.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Oluşturulma: {request?.createdAt}</span>
                  </div>
                )}
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
                    onClick={() =>
                      window.open(`/requests/${request.id}`, "_blank")
                    }
                    className="flex items-center justify-center rounded-lg bg-white p-2 transition-colors hover:bg-gray-200"
                    aria-label="Open in new tab"
                  >
                    <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
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

          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4">
              {request.demandData && request.demandData.length > 0 && (
                <div>
                  <h3 className="mb-4 font-medium text-gray-900">
                    Talep Detayları
                  </h3>
                  <DynamicForm
                    ref={formRef}
                    fields={request.demandData}
                    defaultValues={request.demandData.reduce(
                      (acc, field) => ({
                        ...acc,
                        [field.label]: field.value,
                      }),
                      {},
                    )}
                    isEditing={isEditing}
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    submitButtonProps={{
                      className: "hidden",
                    }}
                  />
                </div>
              )}

              {/* Add the FollowUpDataPreview component */}
              {request.followupDemandData &&
                request.followupDemandData.length > 0 && (
                  <FollowUpDataPreview
                    followupData={request.followupDemandData}
                    request={request}
                    setFollowUpDialogOpen={setFollowUpDialogOpen}
                  />
                )}
            </div>
          </div>
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
