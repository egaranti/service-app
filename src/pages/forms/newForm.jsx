import { useToast } from "@egaranti/components";

import React from "react";
import { useNavigate } from "react-router-dom";

import useFormStore from "@/stores/formStore";

import FormBuilder from "@/components/forms/formBuilder";

const NewForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createForm } = useFormStore();

  const handleSubmit = async (formData) => {
    try {
      const result = await createForm(formData);
      if (result) {
        toast({
          variant: "success",
          description: "Form başarıyla oluşturuldu",
        });
        navigate("/forms");
      }
    } catch (error) {
      toast({
        description: error.message || "Form oluşturulurken bir hata oluştu",
        variant: "error",
      });
    }
  };

  const initialData = [
    {
      orderKey: "form_1",
      title: "",
      parentFormId: 0,
      fields: [],
    },
    {
      orderKey: "form_2",
      title: "",
      parentFormId: 0,
      fields: [],
    },
  ];

  return (
    <FormBuilder initialData={initialData} onSubmit={handleSubmit} mode="new" />
  );
};

export default NewForm;
