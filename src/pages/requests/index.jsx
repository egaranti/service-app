import { Button } from "@egaranti/components";

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useRequestStore from "@/stores/requestStore";

import RequestFilters from "@/components/requests/requestFilters";
import RequestTable from "@/components/requests/requestTable";

import { Plus } from "lucide-react";

const RequestsPage = () => {
  const {
    requests,
    filterDefinitions,
    loading,
    filters,
    fetchRequests,
    fetchFilterDefinitions,
    setFilters,
  } = useRequestStore();

  useEffect(() => {
    fetchFilterDefinitions();
    fetchRequests();
  }, [fetchFilterDefinitions, fetchRequests]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111729]">Talepler</h1>
            <p className="text-[#717680]">
              Bu sayfada oluşturduğunuz talepleri görebilir ve
              düzenleyebilirsiniz.
            </p>
          </div>
          <Button className="gap-2 bg-[#0049e6]" asChild>
            <Link to="/requests/new">
              <Plus className="h-4 w-4" />
              Yeni Form Oluştur
            </Link>
          </Button>
        </div>
        <RequestFilters
          filters={filters}
          setFilters={setFilters}
          filterDefinitions={filterDefinitions}
        />
        <RequestTable data={requests} filterDefinitions={filterDefinitions} />
      </main>
    </div>
  );
};

export default RequestsPage;
