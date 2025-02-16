import { useToast } from "@egaranti/components";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useFormStore from "@/stores/formStore";

import FormBuilder from "@/components/forms/formBuilder";

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const { getFormById, updateForm } = useFormStore();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const forms = await getFormById(Number(id));
        if (!Array.isArray(forms)) {
          throw new Error("API response is not in expected format");
        }

        // Set the form data directly from the API response
        setFormData(forms);
      } catch (error) {
        toast({
          title: "Hata",
          description: error.message || "Form yüklenirken bir hata oluştu",
          variant: "error",
        });
        navigate("/forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      // Convert the form data to match the API's expected structure
      const updateData = data.map((form) => ({
        id: form.id,
        orderKey: form.orderKey || "",
        title: form.title || "",
        parentFormId: form.parentFormId,
        fields:
          form.fields?.map((field) => ({
            id: field.id,
            label: field.label || "",
            order: field.order || 0,
            type: field.type || "TEXT",
            required: field.required || false,
            hiddenForCustomer: field.hiddenForCustomer || false,
            placeholder: field.placeholder || "",
            options: field.options || [],
            status: field.status || [],
            merchantId: field.merchantId || useFormStore.getState().merchantId,
          })) || [],
      }));

      const result = await updateForm(Number(id), updateData);
      if (result) {
        toast({
          title: "Başarılı",
          description: "Form başarıyla güncellendi",
          variant: "success",
        });
        navigate("/forms");
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: error.message || "Form güncellenirken bir hata oluştu",
        variant: "error",
      });
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <FormBuilder initialData={formData} onSubmit={handleSubmit} mode="edit" />
  );
};

export default EditForm;
