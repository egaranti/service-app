import { Button } from "@egaranti/components";

import { useNavigate } from "react-router-dom";

import { FileText, ListChecks, PenLine, SendIcon } from "lucide-react";

export default function FormCard({ form }) {
  const navigate = useNavigate();

  const handleUseForm = (formId) => {
    navigate(`/requests/new?formId=${formId}`);
  };

  return (
    <div className="flex flex-col rounded-lg border bg-white p-4 transition-all hover:border-gray-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-md bg-[#0049e6] p-2 opacity-90">
            <FileText className="h-5 w-5 text-gray-100" />
          </div>
          <h2 className="text-lg font-semibold text-[#111729]">
            {form?.title}
          </h2>
        </div>
      </div>
      <div className="flex-1">
        <p className="mt-2 text-gray-600">{form?.description}</p>
        <div className="mt-8">
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <ListChecks className="h-4 w-4" />
              <span>Alt Formlar</span>
              <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-xs text-gray-100">
                {form?.childForms?.length || 0}
              </span>
              {form?.childForms?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {form.childForms.map(child => (
                    <div key={child.id} className="flex items-center gap-2 text-sm text-gray-500">
                      <span>↳</span>
                      <span>{child.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
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
  );
}
