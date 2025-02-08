import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import formService from "@/services/formService";
import requestService from "@/services/requestService";

import DynamicForm from "@/components/forms/DynamicForm";

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        const { data } = await formService.getForms();
        setForms(data.content || []);
      } catch (error) {
        console.error("Error loading forms:", error);
      }
    };
    loadForms();
  }, []);

  const handleSubmit = async (values) => {
    if (!selectedForm) {
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        formId: selectedForm.id,
        formData: values,
        fields: selectedForm.fields,
        status: "pending",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await requestService.createRequest(requestData);

      navigate("/requests");
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111729]">
            Yeni Talep Oluştur
          </h1>
          <p className="mt-2 text-gray-600">
            Lütfen talep formunu doldurun ve gönderin.
          </p>
        </div>

        <div className="mb-6 p-6">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Form Seçin
            </label>
            <Select
              onValueChange={(value) => {
                const form = forms.find((f) => f.id === value);
                setSelectedForm(form);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Form seçin" />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedForm && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium">{selectedForm.name}</h3>
              <p className="text-gray-600">{selectedForm.description}</p>
            </div>

            <DynamicForm
              fields={selectedForm.fields}
              onSubmit={handleSubmit}
              isEditing={true}
              submitButtonProps={{
                className: "mt-6 w-full",
                disabled: loading,
                children: loading ? "Gönderiliyor..." : "Talebi Gönder"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRequestPage;
