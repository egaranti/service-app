import { Button } from "@egaranti/components";

import CostPreview from "./costPreview";
import FollowUpDataPreview from "./followUpDataPreview";

import DynamicForm from "@/components/forms/dynamicForm";

const RequestDetailContent = ({
  request,
  isEditing,
  setIsEditing,
  formRef,
  handleSubmit,
  setFollowUpDialogOpen,
  saving,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="grid gap-6">
        {request.demandData && request.demandData.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 font-medium text-gray-900">
                Talep Detayları
              </h3>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="default"
                      onClick={() => setIsEditing(true)}
                      className="h-9"
                    >
                      Düzenle
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="secondaryColor"
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => formRef.current?.requestSubmit()}
                      disabled={saving}
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <DynamicForm
              ref={formRef}
              fields={request.demandData}
              defaultValues={request.demandData.reduce(
                (acc, field) => ({
                  ...acc,
                  [field.label]: field.value,
                }),
                {},
              )}
              isEditing={isEditing}
              className="space-y-4"
              onSubmit={handleSubmit}
              submitButtonProps={{
                className: "hidden",
              }}
            />
          </div>
        )}

        {/* Follow-up data preview */}
        {request.followupDemandData &&
          request.followupDemandData.length > 0 && (
            <FollowUpDataPreview
              followupData={request.followupDemandData}
              request={request}
              setFollowUpDialogOpen={setFollowUpDialogOpen}
            />
          )}
        {request.totalAllowance > 0 && <CostPreview request={request} />}
      </div>
    </div>
  );
};

export default RequestDetailContent;
