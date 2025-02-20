import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import formService from "@/services/formService";
import requestService from "@/services/requestService";

import DynamicForm from "@/components/forms/DynamicForm";
import FollowUpFormDialog from "@/components/forms/FollowUpFormDialog";
import Breadcrumb from "@/components/shared/breadcrumb";

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [formTemplate, setFormTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Talepler", path: "/requests" },
    { label: `Talep #${id}` },
  ];

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data: requestData } = await requestService.getRequestById(id);
        const { data: formData } = await formService.getFormById(
          requestData.formId,
        );
        setRequest(requestData);
        setFormTemplate({
          name: formData.name,
          description: formData.description,
          fields: formData.fields,
          followUpFields: formData.followUpFields,
        });
        setForm({
          ...requestData.formData,
          status: requestData.status,
          priority: requestData.priority,
        });
      } catch (error) {
        console.error("Error fetching request data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const updatedData = {
        ...request,
        status: values.status,
        priority: values.priority,
        formData: values,
      };

      await requestService.updateRequest(id, updatedData);
      setRequest(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating request:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!request || !formTemplate) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Talep bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafc] p-8">
      <div className="container mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#111729]">
              Talep Detayı
            </h1>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  {formTemplate?.followUpFields && (
                    <Button
                      variant="secondaryGray"
                      onClick={() => setFollowUpDialogOpen(true)}
                    >
                      İşlem Ekle
                    </Button>
                  )}
                  <Button variant="default" onClick={() => setIsEditing(true)}>
                    Düzenle
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        ...request.formData,
                        status: request.status,
                        priority: request.priority,
                      });
                    }}
                  >
                    İptal
                  </Button>
                  <Button disabled={saving} onClick={handleSubmit}>
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(form);
              }}
            >
              {formTemplate && (
                <>
                  <div className="mb-4">
                    <h3 className="mb-4 text-lg font-medium">
                      {formTemplate.name}
                    </h3>
                    <p className="mb-6 text-gray-600">
                      {formTemplate.description}
                    </p>
                  </div>

                  <DynamicForm
                    fields={formTemplate.fields}
                    onSubmit={handleSubmit}
                    defaultValues={form}
                    isEditing={isEditing}
                  />
                </>
              )}
            </form>
          </div>
          {formTemplate?.followUpFields && (
            <FollowUpFormDialog
              open={followUpDialogOpen}
              onOpenChange={setFollowUpDialogOpen}
              followUpFields={formTemplate.followUpFields}
              onSubmit={async (values) => {
                const updatedData = {
                  ...request,
                  followUpData: values,
                  status: values.status || request.status,
                };
                await requestService.updateRequest(id, updatedData);
                setRequest(updatedData);
              }}
              defaultValues={request.followUpData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
