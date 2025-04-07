import React from "react";

import { File, FileSpreadsheetIcon, LoaderIcon } from "lucide-react";

const FileUploadStep = ({
  onDrop,
  file,
  isDragActive,
  isProcessing,
  getRootProps,
  getInputProps,
}) => {
  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <LoaderIcon className="mx-auto h-16 w-16 animate-spin text-blue-600" />
        ) : (
          <FileSpreadsheetIcon className="mx-auto h-16 w-16 text-blue-600" />
        )}
        <p className="mt-4 text-base font-medium text-gray-700">
          {isDragActive
            ? "Dosyayı buraya bırakın"
            : "CSV veya Excel dosyasını yükleyin"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Dosyayı sürükleyip bırakın veya{" "}
          <span className="font-medium text-blue-600">
            gözatmak için tıklayın
          </span>
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Desteklenen formatlar: .csv, .xlsx, .xls
        </p>
      </div>
    </div>
  );
};

export default FileUploadStep;
