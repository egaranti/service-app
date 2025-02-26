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
    setFilters({ page });
  };

  return (
    <div className="h-[calc(100vh-200px)] space-y-4">
      <ScrollArea className="h-[calc(100%-60px)]">
        <div>
          {requests.length === 0 && <EmptyState />}
          {requests.map((request) => (
            <div key={request.id} onClick={() => handleRequestSelect(request)}>
              <RequestCard
                request={request}
                isSelected={selectedRequest?.id === request.id}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      <Pagination
        currentPage={filters.page}
        totalPages={filters.totalPage}
        pageSize={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RequestList;
