import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@egaranti/components";

import { Link } from "react-router-dom";

import { Plus, Search } from "lucide-react";

export default function RequestsListPage() {
  const forms = [
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
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#111729]">Talepler</h1>
            <p className="text-[#717680]">
              Bu sayfada oluşturduğunuz formları görebilir ve
              düzenleyebilirsiniz.
            </p>
          </div>
          <Button className="gap-2 bg-[#0049e6]" asChild>
            <Link href="/forms/new">
              <Plus className="h-4 w-4" />
              Yeni Talep Aç
            </Link>
          </Button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-[19px] h-4 w-4 text-[#717680]" />
            <Input placeholder="Search forms..." className="max-w-sm pl-9" />
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
              {forms.map((form) => (
                <TableRow key={form.id}>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
