import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@egaranti/components";
import { Pagination } from "@egaranti/components";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useFormStore from "@/stores/useFormStore";
import useRequestStore from "@/stores/useRequestStore";

import RequestFilters from "@/components/requests/requestFilters";
import RequestStats from "@/components/requests/requestStats";
import RequestTable from "@/components/requests/requestTable";

import { ChevronDown } from "lucide-react";

const RequestsPage = () => {
  const navigate = useNavigate();
  const {
    requests,
    filterDefinitions,
    loading,
    filters,
    fetchRequests,
    fetchFilterDefinitions,
    setFilters,
  } = useRequestStore();

  const { loading: formLoading, forms, fetchForms } = useFormStore();

  useEffect(() => {
    fetchFilterDefinitions();
    fetchRequests();
    fetchForms();
  }, [fetchFilterDefinitions, fetchRequests, fetchForms]);

  if (loading || formLoading) {
    return <div aria-busy className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-4 py-8">
        <RequestStats
          stats={{
            total: requests?.length || 0,
            pending:
              requests?.filter((r) => r.status === "pending")?.length || 0,
            completed:
              requests?.filter((r) => r.status === "completed")?.length || 0,
          }}
        />
        <div className="mb-8 mt-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-[#111729]">Talepler</h1>
            <p className="text-[#717680]">
              Bu sayfada oluşturduğunuz talepleri görebilir ve
              düzenleyebilirsiniz.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="mt-4 w-full gap-2 bg-[#0049e6] sm:mt-0 md:w-auto"
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
        <RequestFilters
          filters={filters}
          setFilters={setFilters}
          filterDefinitions={filterDefinitions}
        />
        {requests.length === 0 ? (
          <div className="rounded-lg border bg-white">
            <p className="block py-4 text-center text-gray-500">
              Gösterilecek veri bulunamadı
            </p>
          </div>
        ) : (
          <RequestTable data={requests} filterDefinitions={filterDefinitions} />
        )}
        {/* <Pagination
          currentPage={filters.page}
          totalPage={filters.totalPages}
          onPageChange={(page) => setFilters({ page })}
        /> */}
      </main>
    </div>
  );
};

export default RequestsPage;
