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

import {
  Calendar,
  CheckSquare,
  Eye,
  FileInput,
  FileText,
  Hash,
  ListChecks,
  Mail,
  MessageSquare,
  PenLine,
  Plus,
  Radio,
  Search,
  SendIcon,
  Type,
  User,
} from "lucide-react";

export default function FormsListPage() {
  const navigate = useNavigate();
  const { loading, filters, filterDefinitions, setFilters, fetchForms } =
    useFormStore();

  const getFieldTypeIcon = (type) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "textarea":
        return <MessageSquare className="h-4 w-4" />;
      case "number":
        return <Hash className="h-4 w-4" />;
      case "date":
        return <Calendar className="h-4 w-4" />;
      case "checkbox":
        return <CheckSquare className="h-4 w-4" />;
      case "select":
        return <ListChecks className="h-4 w-4" />;
      case "radio":
        return <Radio className="h-4 w-4" />;
      case "file":
        return <FileInput className="h-4 w-4" />;
      case "assignee":
        return <User className="h-4 w-4" />;
      case "status":
        return <ListChecks className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 60%)`;
  };

  const forms = [
    {
      id: 1,
      title: "Task Form",
      description: "Detailed task creation form with various fields",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "assignee", type: "assignee" },
        { name: "status", type: "select" },
        { name: "priority", type: "radio" },
        { name: "dueDate", type: "date" },
        { name: "estimatedHours", type: "number" },
        { name: "attachments", type: "file" },
        { name: "completed", type: "checkbox" },
      ],
    },
  ];

  const handleUseForm = (formId) => {
    navigate(`/requests/new?formId=${formId}`);
  };

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      {/* Main Content */}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {forms?.map((form) => (
              <div
                key={form.id}
                className="flex flex-col rounded-lg border bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center rounded-md p-2"
                      style={{ backgroundColor: getRandomPastelColor() }}
                    >
                      <FileText className="h-5 w-5 text-gray-100" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#111729]">
                      {form?.title}
                    </h2>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="mt-2 text-[#717680]">{form?.description}</p>
                  <div className="mt-4">
                    <p className="mb-3 text-sm font-medium">
                      Form Elemanları ({form?.fields.length})
                    </p>
                    <ul className="space-y-2">
                      {form?.fields.map((field, index) => (
                        <li
                          key={index}
                          className="text-muted-foreground flex items-center gap-2 text-sm"
                        >
                          {getFieldTypeIcon(field.type)}
                          <span>{field.name}</span>
                          <span className="bg-muted ml-auto rounded-full px-2 py-0.5 text-xs">
                            {field.type}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={() => navigate(`/forms/edit/${form.id}`)}
                    variant="secondaryColor"
                    className="flex-1"
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Düzenle
                  </Button>
                  <Button
                    onClick={() => handleUseForm(form.id)}
                    variant="secondaryColor"
                    className="flex-1"
                  >
                    <SendIcon className="mr-2 h-4 w-4" />
                    Kullan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
