import { useToast } from "@egaranti/components";

import React from "react";
import { useNavigate } from "react-router-dom";

import FormService from "@/services/formService";

import FormBuilder from "@/components/forms/formBuilder";

const NewForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      await FormService.createForm(formData);
      toast({
        variant: "success",
        description: "Form başarıyla oluşturuldu",
      });
      navigate("/forms");
    } catch (error) {
      toast({
        description: error.message || "Form oluşturulurken bir hata oluştu",
        variant: "error",
      });
    }
  };

  return <FormBuilder initialData={{}} onSubmit={handleSubmit} mode="new" />;
};

export default NewForm;
