import {
  Button,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@egaranti/components";

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useFormStore from "@/stores/formStore";

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

  const mockForms = [
    {
      id: 1,
      name: "Customer Feedback Form",
      description: "Collect feedback from customers about our services",
      createdAt: "01.02.2025",
      status: "active",
      submissions: 145,
    },
    {
      id: 2,
      name: "Service Request Form",
      description: "Allow customers to request technical service",
      createdAt: "28.01.2025",
      status: "draft",
      submissions: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111729]">Formlar</h1>
            <p className="text-[#717680]">
              Bu sayfada oluşturduğunuz formları görebilir ve
              düzenleyebilirsiniz.
            </p>
          </div>
          <Button className="gap-2 bg-[#0049e6]" asChild>
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
                        <option value="">Tümü</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  );
                // Add more filter types as needed (daterange, etc.)
                default:
                  return null;
              }
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : forms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center">
                    No forms found
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow
                    key={form.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(form.id)}
                  >
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell className="text-[#717680]">
                      {form.description}
                    </TableCell>
                    <TableCell>{form.createdAt}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm ${
                          form.status === "active"
                            ? "bg-[#ecfdf3] text-[#027a48]"
                            : "bg-[#f2f4f7] text-[#344054]"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {form.status === "active" ? "Active" : "Draft"}
                      </div>
                    </TableCell>
                    <TableCell>{form.submissions}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
