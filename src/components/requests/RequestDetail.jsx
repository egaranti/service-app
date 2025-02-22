import { Button } from "@egaranti/components";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useRequestStore from "@/stores/useRequestStore";

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
  const navigate = useNavigate();
  const [request, setRequest] = useState(initialRequest);
  const { loading, errors, fetchRequestById, clearErrors } = useRequestStore();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchRequestById(initialRequest.id);
        setRequest(data);
      } catch (error) {
        // Error is handled by the store
      }
    };

    fetchDetails();

    return () => {
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
    <div className="h-full overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
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
              <button
                onClick={() => window.open(`/requests/${request.id}`, "_blank")}
                className="flex items-center justify-center rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                aria-label="Open in new tab"
              >
                <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                aria-label="Close details"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {request.demandData && request.demandData.length > 0 && (
                <div>
                  <h3 className="mb-4 font-medium text-gray-900">
                    Talep Detayları
                  </h3>
                  <div className="space-y-4">
                    {request.demandData.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">
                            {item.label}
                          </h4>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="mt-2 text-gray-500">{item.value}</p>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
};

export default RequestDetail;
