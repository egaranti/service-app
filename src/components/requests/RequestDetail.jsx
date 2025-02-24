import { Button } from "@egaranti/components";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useRequestStore from "@/stores/useRequestStore";

import DynamicForm from "@/components/forms/dynamicForm";
import FollowUpFormDialog from "@/components/forms/followUpFormDialog";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, ExternalLinkIcon, X } from "lucide-react";

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
    <Button onClick={onRetry} variant="outline">
      Retry
    </Button>
  </div>
);

const RequestDetail = ({ request: initialRequest, onClose }) => {
  const formRef = React.useRef(null);
  const [request, setRequest] = useState(initialRequest);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const { loading, errors, fetchRequestById, clearErrors, updateDemandData } =
    useRequestStore();

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
                    <span>
                      Oluşturulma:{" "}
                      {new Date(request.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  {request.followUpFields && (
                    <Button
                      variant="secondaryGray"
                      onClick={() => setFollowUpDialogOpen(true)}
                      className="h-9"
                    >
                      İşlem Ekle
                    </Button>
                  )}
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
                    onSubmit={async (values) => {
                      setSaving(true);
                      try {
                        const updatedDemandData = request.demandData.map(
                          (field) => ({
                            ...field,
                            value: values[field.label] ?? field.value,
                          }),
                        );

                        const updatedRequest = await updateDemandData(
                          request.id,
                          {
                            ...request,
                            demandData: updatedDemandData,
                          },
                        );

                        setRequest(updatedRequest);
                        setIsEditing(false);
                      } catch (error) {
                        console.error("Error updating demand data:", error);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    submitButtonProps={{
                      className: "hidden",
                    }}
                  />
                </div>
              )}

              {request.attachments && request.attachments.length > 0 && (
                <div>
                  <h3 className="mb-4 font-medium text-gray-900">Ekler</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {request.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500"
                      >
                        <span className="truncate text-sm text-gray-600">
                          {attachment.name}
                        </span>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          İndir
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {request.followUpFields && (
        <FollowUpFormDialog
          open={followUpDialogOpen}
          onOpenChange={setFollowUpDialogOpen}
          followUpFields={request.followUpFields}
          onSubmit={async (values) => {
            setSaving(true);
            try {
              const updatedData = {
                ...request,
                followUpData: values,
                status: values.status || request.status,
                lastUpdated: new Date().toISOString(),
              };
              const updatedRequest = await updateDemandData(
                request.id,
                updatedData,
              );
              setRequest(updatedRequest);
            } catch (error) {
              console.error("Error updating follow-up data:", error);
            } finally {
              setSaving(false);
              setFollowUpDialogOpen(false);
            }
          }}
          defaultValues={request.followUpData}
        />
      )}
    </div>
  );
};

export default RequestDetail;
