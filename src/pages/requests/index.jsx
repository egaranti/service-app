import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useFormStore from "@/stores/useFormStore";
import useRequestStore from "@/stores/useRequestStore";

import RequestDetail from "@/components/requests/requestDetail";
import RequestFilterComponent from "@/components/requests/requestFilterComponent";
import RequestList from "@/components/requests/requestList";
import RequestStats from "@/components/requests/requestStats";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizeable";

import { ChevronDown } from "lucide-react";

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
    <p className="mb-4 text-red-600">{error}</p>
    <Button onClick={onRetry} variant="secondaryGray">
      Retry
    </Button>
  </div>
);

const RequestsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    requests,
    loading,
    errors,
    selectedRequest,
    fetchRequests,

    setSelectedRequest,
    clearErrors,
  } = useRequestStore();

  const { loading: formLoading, forms, fetchForms } = useFormStore();

  useEffect(() => {
    fetchRequests();
    fetchForms();
  }, [fetchRequests, fetchForms]);

  // Handle URL state for selected request
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedRequestId = params.get("selectedRequestId");

    if (selectedRequestId && requests.length > 0) {
      const foundRequest = requests.find(
        (r) => String(r.id) === selectedRequestId,
      );
      if (foundRequest) {
        setSelectedRequest(foundRequest);
      }
    } else if (!selectedRequestId && selectedRequest) {
      setSelectedRequest(null);
    }
  }, [location.search, requests, selectedRequest, setSelectedRequest]);

  const handleRetry = () => {
    clearErrors();
    fetchFilterDefinitions();
    fetchRequests();
    fetchForms();
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
    navigate("/requests");
  };

  // if (loading.requests || loading.filterDefinitions || formLoading) {
  //   return <LoadingState />;
  // }

  if (errors.requests || errors.filterDefinitions) {
    return (
      <ErrorState
        error={errors.requests || errors.filterDefinitions}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-6 py-6">
        <RequestStats
          stats={{
            total: requests?.length || 0,
            pending:
              requests?.filter((r) => r.status === "pending")?.length || 0,
            completed:
              requests?.filter((r) => r.status === "completed")?.length || 0,
          }}
        />
        <div className="my-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#111729]">Talepler</h1>
            <p className="mt-1 text-sm text-[#717680]">
              Bu sayfada oluşturduğunuz talepleri görebilir ve
              düzenleyebilirsiniz.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-2 bg-[#0049e6] text-sm font-medium"
                variant="default"
              >
                Yeni Talep Oluştur
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {forms?.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onClick={() => {
                    navigate(`/requests/new?type=${type.id}`);
                  }}
                >
                  {type.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <RequestFilterComponent />
        <ResizablePanelGroup
          direction="horizontal"
          className="mt-6 h-[calc(100vh-530px)] rounded-lg border bg-white"
        >
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={50}
            className="overflow-y-auto border-r bg-white"
          >
            <RequestList />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={70} className="bg-white">
            {selectedRequest ? (
              <RequestDetail
                request={selectedRequest}
                onClose={handleCloseDetail}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <p>Detayları görüntülemek için bir talep seçin</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default RequestsPage;
