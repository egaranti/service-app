import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import Navigation from "./components/Navigation";
import { getStepInfo, LIST_HEIGHT, ROW_HEIGHT, STEPS } from "./constants";
import ColumnMappingStep from "./steps/ColumnMappingStep";
import DataValidationStep from "./steps/DataValidationStep";
import FileUploadStep from "./steps/FileUploadStep";
import { parseFile, processDataWithMapping } from "./utils/fileProcessing";

const BulkImportWizard = ({
  expectedColumns = [
    { key: "name", label: "İsim", required: true },
    { key: "email", label: "E-posta", required: true },
    { key: "phone", label: "Telefon", required: false },
  ],
  onComplete,
  title = "Toplu Veri Yükleme",
  description = "Excel veya CSV dosyasından toplu veri yükleme",
}) => {
  // State
  const [step, setStep] = useState(STEPS.FILE_UPLOAD);
  const [file, setFile] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  // Filtreleme için kullanılacak veri
  const filteredData = processedData;

  // Tablo genişliğini ayarla
  useEffect(() => {
    if (tableRef.current) {
      setTableWidth(tableRef.current.offsetWidth);
    }
  }, [tableRef.current]);

  // Boş tablo ile başlama durumunda
  useEffect(() => {
    if (step === STEPS.DATA_VALIDATION && !file) {
      // Boş kolon eşleştirmesi başlat
      const initialMapping = {};
      expectedColumns.forEach((col) => {
        initialMapping[col.key] = col.key; // Doğrudan anahtar değerini kullan
      });
      setColumnMapping(initialMapping);

      // Başlıkları ayarla
      const headerValues = expectedColumns.map((col) => col.key);
      setHeaders(headerValues);
    }
  }, [step, file, expectedColumns]);

  // Dosya değiştiğinde state'i sıfırla
  useEffect(() => {
    if (file) {
      setHeaders([]);
      setColumnMapping({});
      setValidationErrors([]);
      setProcessedData([]);
    }
  }, [file]);

  // Dosya yükleme işlemi
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    // Dosya türünü doğrula
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(extension)) {
      showToast(
        "error",
        "Geçersiz dosya formatı",
        "Lütfen .csv, .xlsx veya .xls formatında bir dosya yükleyin",
      );
      return;
    }

    setFile(selectedFile);
    handleParseFile(selectedFile, true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  // Toast mesajı gösterme yardımcı fonksiyonu
  const showToast = (type, title, message) => {
    // Basit bir alert göster (gerçek uygulamada toast bileşeni kullanılabilir)
    console.log(`[${type}] ${title}: ${message}`);
    if (type === "error") {
      alert(`${title}: ${message}`);
    }
  };

  // Dosya içeriğini ayrıştır
  const handleParseFile = useCallback(
    (file, autoAdvance = false) => {
      setIsProcessing(true);

      parseFile(
        file,
        (data) => {
          setRawData(data);
          // İlk 5 satırı önizleme olarak göster
          setPreviewData(data.slice(0, 5));

          // İlk satırı header olarak kullan
          if (data.length > 0) {
            setHeaders(data[0]);

            // Boş kolon eşleştirmesi başlat
            const initialMapping = {};
            expectedColumns.forEach((col) => {
              // Otomatik eşleştirme dene
              const matchingHeader = data[0].find(
                (header) =>
                  header && header.toLowerCase() === col.label.toLowerCase(),
              );
              initialMapping[col.key] = matchingHeader || "";
            });
            setColumnMapping(initialMapping);
          }

          setIsProcessing(false);

          // Dosya yüklendikten sonra otomatik olarak bir sonraki adıma geç
          if (autoAdvance) {
            setStep(STEPS.COLUMN_MAPPING);
          }
        },
        (error) => {
          console.error("File parse error:", error);
          showToast(
            "error",
            "Hata",
            error.message || "Dosya okunurken bir hata oluştu",
          );
          setIsProcessing(false);
        },
      );
    },
    [expectedColumns, setStep],
  );

  // Kolon eşleştirme değişikliklerini işle
  const updateColumnMapping = useCallback((expectedKey, fileHeader) => {
    setColumnMapping((prev) => ({
      ...prev,
      [expectedKey]: fileHeader === "_placeholder_" ? "" : fileHeader,
    }));
  }, []);

  // Eşleştirmenin tamamlanıp tamamlanmadığını kontrol et
  const isMappingComplete = useCallback(() => {
    return expectedColumns
      .filter((col) => col.required)
      .every((col) => columnMapping[col.key] && columnMapping[col.key] !== "");
  }, [columnMapping, expectedColumns]);

  // Veriyi kolon eşleştirmesine göre işle
  const processData = useCallback(() => {
    setIsProcessing(true);

    try {
      // Dosya yüklenmişse normal işleme yap
      if (file) {
        const result = processDataWithMapping(
          rawData,
          0, // İlk satırı header olarak kullan
          headers,
          columnMapping,
          expectedColumns,
        );

        setProcessedData(result.processedData);
        setValidationErrors(result.validationErrors);
      } else {
        // Boş tablo durumunda boş veri oluştur
        setProcessedData([]);
        setValidationErrors([]);
      }

      setStep(STEPS.DATA_VALIDATION);
    } catch (error) {
      console.error("Data processing error:", error);
      showToast("error", "İşleme Hatası", "Veriler işlenirken bir hata oluştu");
    } finally {
      setIsProcessing(false);
    }
  }, [rawData, file, headers, columnMapping, expectedColumns]);

  // Form gönderimi
  const handleSubmit = useCallback(async () => {
    if (processedData.length === 0 && validationErrors.length === 0) {
      showToast("error", "Veri Yok", "Yüklenecek veri bulunamadı");
      return;
    }

    if (validationErrors.length > 0) {
      showToast("error", "Doğrulama Hataları", "Lütfen hataları düzeltin");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onComplete) {
        await onComplete(processedData);
        showToast("success", "Başarılı", "Veriler başarıyla yüklendi");

        // State'i sıfırla
        setFile(null);
        setRawData([]);
        setPreviewData([]);
        setHeaders([]);
        setColumnMapping({});
        setValidationErrors([]);
        setProcessedData([]);
        setStep(STEPS.FILE_UPLOAD);
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("error", "Hata", "Veriler yüklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }, [processedData, validationErrors, onComplete]);

  // Adım içeriğini render et
  const renderStepContent = () => {
    switch (step) {
      case STEPS.FILE_UPLOAD:
        return (
          <FileUploadStep
            onDrop={onDrop}
            file={file}
            isDragActive={isDragActive}
            isProcessing={isProcessing}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        );

      case STEPS.COLUMN_MAPPING:
        return (
          <ColumnMappingStep
            expectedColumns={expectedColumns}
            headers={headers}
            columnMapping={columnMapping}
            updateColumnMapping={updateColumnMapping}
            previewData={previewData}
            selectedHeaderIndex={0}
          />
        );

      case STEPS.DATA_VALIDATION:
        return (
          <DataValidationStep
            tableRef={tableRef}
            tableWidth={tableWidth}
            columnMapping={columnMapping}
            expectedColumns={expectedColumns}
            filteredData={filteredData}
            validationErrors={validationErrors}
            ROW_HEIGHT={ROW_HEIGHT}
            LIST_HEIGHT={LIST_HEIGHT}
            setProcessedData={setProcessedData}
          />
        );
      default:
        return null;
    }
  };

  // Adım bilgisini al
  const stepInfo = getStepInfo(step);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b bg-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Content */}
      <div className="max-h-[calc(100vh-200px)] flex-grow overflow-auto p-6">
        {/* Adım başlığı ve açıklaması */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {stepInfo.title}
          </h2>
          <p className="text-sm text-gray-500">{stepInfo.description}</p>
        </div>

        {/* Adım içeriği */}
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-4">
        <Navigation
          step={step}
          setStep={setStep}
          file={file}
          isProcessing={isProcessing}
          isSubmitting={isSubmitting}
          isMappingComplete={isMappingComplete()}
          processData={processData}
          handleSubmit={handleSubmit}
          processedData={processedData}
          validationErrors={validationErrors}
        />
      </div>
    </div>
  );
};

export default BulkImportWizard;
