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
          setFormData(form);
        } else {
          toast({
            title: "Hata",
            description: "Form bulunamadı",
            variant: "destructive",
          });
          navigate("/forms");
        }
      } catch (error) {
        toast({
          title: "Hata",
          description: error.message || "Form yüklenirken bir hata oluştu",
          variant: "destructive",
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
      await updateForm(Number(id), data);
      toast({
        title: "Başarılı",
        description: "Form başarıyla güncellendi",
      });
      navigate("/forms");
    } catch (error) {
      toast({
        title: "Hata",
        description: error.message || "Form güncellenirken bir hata oluştu",
        variant: "destructive",
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
