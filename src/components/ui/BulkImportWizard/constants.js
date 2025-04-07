export const STEPS = {
  FILE_UPLOAD: 0,
  COLUMN_MAPPING: 1,
  DATA_VALIDATION: 2,
};

export const ROW_HEIGHT = 45;
export const HEADER_HEIGHT = 40;
export const LIST_HEIGHT = 400;

export const getStepInfo = (step) => {
  switch (step) {
    case STEPS.FILE_UPLOAD:
      return {
        title: "Veri Girişi",
        description: "Excel/CSV dosyası yükleyin veya boş tablo ile başlayın",
      };
    case STEPS.COLUMN_MAPPING:
      return {
        title: "Kolon Eşleştirme",
        description:
          "Sisteme yüklenecek alanları dosyadaki sütunlarla eşleştirin",
      };
    case STEPS.DATA_VALIDATION:
      return {
        title: "Veri Düzenleme",
        description: "Verileri düzenleyin ve onaylayın",
      };
    default:
      return {
        title: "",
        description: "",
      };
  }
};
