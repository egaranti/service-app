import { Button } from "@egaranti/components";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import requestService from "@/services/requestService";

import DynamicForm from "@/components/forms/dynamicForm";
import FollowUpFormDialog from "@/components/forms/followUpFormDialog";
import Breadcrumb from "@/components/shared/breadcrumb";

export default function RequestDetailPage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const formRef = useRef(null);

  const breadcrumbItems = [
    { label: "Talepler", path: "/requests" },
    { label: `Talep #${id}` },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchRequest = async () => {
      try {
        const data = await requestService.getRequestById(id);
        if (isMounted) {
          setRequest(data);
          setFormData(data.formData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequest();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    if (!values) return;

    setSaving(true);
    try {
      const updatedData = {
        ...request,
        priority: values.priority ?? request.priority,
        formData: values,
        lastUpdated: new Date().toISOString(),
      };

      const updatedRequest = await requestService.updateRequest(
        id,
        updatedData,
      );
      setRequest(updatedRequest);
      setFormData(updatedRequest.formData);
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
                  {request.demandData?.followUpFields && (
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
                    variant="secondaryColor"
                    onClick={() => {
                      setIsEditing(false);
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
            <div>
              {request.demandData && (
                <>
                  <div className="mb-4">
                    <h3 className="mb-4 text-lg font-medium">
                      {request.demandData.name}
                    </h3>
                    <p className="mb-6 text-gray-600">
                      {request.demandData.description}
                    </p>
                  </div>

                  <DynamicForm
                    ref={formRef}
                    fields={request.demandData}
                    defaultValues={formData}
                    isEditing={isEditing}
                    onSubmit={handleSubmit}
                    submitButtonProps={{
                      className: "hidden",
                    }}
                  />
                </>
              )}
            </div>
          </div>
          {request.demandData?.followUpFields && (
            <FollowUpFormDialog
              open={followUpDialogOpen}
              onOpenChange={setFollowUpDialogOpen}
              followUpFields={request.demandData.followUpFields}
              onSubmit={async (values) => {
                setSaving(true);
                try {
                  const updatedData = {
                    ...request,
                    followUpData: values,
                    lastUpdated: new Date().toISOString(),
                  };
                  const updatedRequest = await requestService.updateRequest(
                    id,
                    updatedData,
                  );
                  setRequest(updatedRequest);
                  setFollowUpDialogOpen(false);
                } catch (error) {
                  console.error("Error updating follow-up data:", error);
                } finally {
                  setSaving(false);
                }
              }}
              defaultValues={request.followUpData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
