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
        const form = await getFormById(Number(id));
        if (form) {
          // Prepare form data according to the API structure
          const preparedForm = {
            id: form.id,
            orderKey: form.orderKey || "",
            title: form.title || "",
            parentFormId: form.parentFormId || 0,
            fields: form.fields || []
          };
          setFormData(preparedForm);
        } else {
          toast({
            title: "Hata",
            description: "Form bulunamadı",
            variant: "error",
          });
          navigate("/forms");
        }
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
  }, [id, getFormById, navigate, toast]);

  const handleSubmit = async (data) => {
    try {
      // Prepare update data according to the API structure
      const updateData = {
        id: Number(id),
        orderKey: data.orderKey,
        title: data.title,
        parentFormId: data.parentFormId,
        fields: data.fields.map(field => ({
          ...field,
          id: field.id || undefined, // Remove id if it's a new field
          status: field.status || ["ACTIVE"]
        }))
      };

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
