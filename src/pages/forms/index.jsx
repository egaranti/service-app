import { Button } from "@egaranti/components";

import { Link } from "react-router-dom";

import useFormStore from "@/stores/formStore";

import FormCard from "@/components/forms/FormCard";
import FormFilters from "@/components/forms/FormFilters";

import { Plus } from "lucide-react";

export default function FormsListPage() {
  const { loading, filters, filterDefinitions, setFilters, fetchForms } =
    useFormStore();

  const forms = [
    {
      id: 1,
      title: "Task Form",
      description: "Detailed task creation form with various fields",
      subFormCount: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-[#111729]">Formlar</h1>
            <p className="text-[#717680]">
              Bu sayfada oluşturduğunuz formları görebilir ve
              düzenleyebilirsiniz.
            </p>
          </div>
          <Button
            className="mt-4 w-full gap-2 bg-[#0049e6] sm:mt-0 md:w-auto"
            asChild
          >
            <Link to="/forms/new">
              <Plus className="h-4 w-4" />
              Yeni Form Oluştur
            </Link>
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <FormFilters
            filterDefinitions={filterDefinitions}
            filters={filters}
            setFilters={setFilters}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {forms?.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
