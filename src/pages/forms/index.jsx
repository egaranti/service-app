import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useFormStore from "@/stores/formStore";

import DynamicTable from "@/components/requests/dynamicTable";

import { Plus, Search } from "lucide-react";

export default function FormsListPage() {
  const navigate = useNavigate();
  const { forms, loading, filters, filterDefinitions, setFilters, fetchForms } =
    useFormStore();

  useEffect(() => {
    fetchForms();
  }, []);

  const handleRowClick = (formId) => {
    navigate(`/forms/edit/${formId}`);
  };

  const columns = [
    { key: "name", label: "Form Name" },
    { key: "description", label: "Description" },
    { key: "createdAt", label: "Created Date" },
    {
      label: "Status",
      render: (status) => (
        <div
          className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm ${
            status === "active"
              ? "bg-[#ecfdf3] text-[#027a48]"
              : "bg-[#f2f4f7] text-[#344054]"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status === "active" ? "Active" : "Draft"}
        </div>
      ),
    },
    { key: "submissions", label: "Submissions" },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-[#111729]">Talepler</h1>
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
          <div className="flex flex-wrap gap-4">
            {filterDefinitions.map((filter) => {
              switch (filter.type) {
                case "text":
                  return (
                    <div key={filter.key} className="min-w-[200px] flex-1">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {filter.label}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-[10px] h-4 w-4 text-[#717680]" />
                        <Input
                          placeholder={filter.placeholder}
                          className="pl-9"
                          value={filters[filter.key] || ""}
                          onChange={(e) =>
                            setFilters({ [filter.key]: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  );
                case "select":
                  return (
                    <div key={filter.key} className="min-w-[200px] flex-1">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {filter.label}
                      </label>
                      <Select
                        value={filters[filter.key] || ""}
                        onValueChange={(value) =>
                          setFilters({ [filter.key]: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>Tümü</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem
                              key={
                                typeof option === "object"
                                  ? option.value
                                  : option
                              }
                              value={
                                typeof option === "object"
                                  ? option.value
                                  : option
                              }
                            >
                              {typeof option === "object"
                                ? option.label
                                : option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <DynamicTable
            columns={columns}
            data={forms}
            onRowClick={handleRowClick}
          />
        </div>
      </main>
    </div>
  );
}
