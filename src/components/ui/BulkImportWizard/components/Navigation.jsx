import { Button } from "@egaranti/components";

import React from "react";
import { memo } from "react";

import { STEPS } from "../constants";

import { ArrowRight, Loader2, Undo2Icon } from "lucide-react";

const Navigation = ({
  step,
  setStep,
  file,
  isProcessing,
  isSubmitting,
  isMappingComplete,
  processData,
  handleSubmit,
  processedData,
  validationErrors,
}) => {
  // Geri butonu için ortak özellikler
  const backButtonDisabled =
    step === STEPS.FILE_UPLOAD || isProcessing || isSubmitting;

  // İleri/Yükle butonu için duruma göre özellikler
  const getForwardButtonProps = () => {
    switch (step) {
      case STEPS.FILE_UPLOAD:
        return {
          onClick: file
            ? () => setStep(STEPS.COLUMN_MAPPING)
            : () => setStep(STEPS.DATA_VALIDATION),
          disabled: isProcessing,
          text: file ? "İlerle" : "Boş Tablo ile Başla",
          icon: "arrow-right",
          loading: isProcessing,
          primary: true,
        };
      case STEPS.COLUMN_MAPPING:
        return {
          onClick: processData,
          disabled: !isMappingComplete || isProcessing,
          text: "İlerle",
          icon: "arrow-right",
          loading: isProcessing,
          primary: true,
        };
      case STEPS.DATA_VALIDATION:
        return {
          onClick: handleSubmit,
          disabled:
            processedData.length === 0 ||
            isSubmitting ||
            validationErrors.length > 0,
          text: "Yükle",
          icon: "upload",
          loading: isSubmitting,
          primary: true,
        };
      default:
        return {
          onClick: () => {},
          disabled: true,
          text: "İlerle",
          icon: "arrow-right",
          loading: false,
          primary: true,
        };
    }
  };

  const forwardButtonProps = getForwardButtonProps();

  return (
    <div className="flex items-center justify-between">
      {/* Geri butonu */}
      <Button
        variant="secondaryColor"
        onClick={() => setStep((prev) => Math.max(0, prev - 1))}
        disabled={backButtonDisabled}
      >
        <Undo2Icon className="h-4 w-4" />
        Geri
      </Button>

      {/* İlerleme göstergesi */}
      <div className="hidden text-center sm:block">
        <div className="flex items-center space-x-2">
          {Object.values(STEPS).map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full ${
                s === step
                  ? "bg-blue-600"
                  : s < step
                    ? "bg-blue-300"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* İleri/Yükle butonu */}
      <Button
        onClick={forwardButtonProps.onClick}
        disabled={forwardButtonProps.disabled}
        variant={forwardButtonProps.primary ? "" : "secondaryColor"}
        className="flex items-center gap-2"
      >
        {forwardButtonProps.loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : forwardButtonProps.icon === "arrow-right" ? (
          <ArrowRight className="h-4 w-4" />
        ) : null}
        {forwardButtonProps.text}
      </Button>
    </div>
  );
};

export default memo(Navigation);
