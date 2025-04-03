import { Pagination, ScrollArea } from "@egaranti/components";

import React from "react";
import { useNavigate } from "react-router-dom";

import RequestCard from "./requestCard";

import useRequestStore from "@/stores/useRequestStore";

const LoadingSkeleton = () => (
  <div className="space-y-2 p-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse rounded-md border border-gray-200 p-3"
      >
        <div className="space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-1/4 rounded bg-gray-200"></div>
            <div className="h-5 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
    <p className="text-gray-500">Talep bulunamadı</p>
    <p className="mt-1 text-sm text-gray-400">
      Talep oluşturmak için yukarıdaki butona tıklayın
    </p>
  </div>
);

const RequestList = () => {
  const navigate = useNavigate();
  const {
    requests,
    selectedRequest,
    setSelectedRequest,
    loading,
    filters,
    setFilters,
  } = useRequestStore();

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    navigate(`/requests?selectedRequestId=${request.id}`);
  };

  if (loading.requests) {
    return <LoadingSkeleton />;
  }

  const handlePageChange = (page) => {
    setFilters((currentFilters) => ({ ...currentFilters, page }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        {requests.length === 0 && <EmptyState />}
        {requests.length > 0 && (
          <ScrollArea className="h-full border-r">
            <div className="space-y-1">
              {requests.map((request) => (
                <div key={request.id}>
                  <RequestCard
                    request={request}
                    isSelected={selectedRequest?.id === request.id}
                    onClick={() => handleRequestSelect(request)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {requests.length > 0 && (
        <div className="border-t bg-white py-2">
          <Pagination
            currentPage={filters.page}
            totalPages={filters.totalPages}
            pageSize={10}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RequestList;
