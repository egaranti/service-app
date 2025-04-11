import Papa from "papaparse";
import * as XLSX from "xlsx";

/**
 * CSV dosyasını ayrıştırır
 * @param {string} fileData - Dosya içeriği
 * @returns {Promise<Array>} - Ayrıştırılmış veri
 */
export const parseCSV = (fileData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileData, {
      worker: true,
      complete: (results) => {
        const data = results.data;
        if (data && data.length > 0) {
          resolve(data);
        } else {
          reject(new Error("Dosya boş veya geçersiz bir format içeriyor"));
        }
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        reject(new Error("CSV dosyası okunurken bir hata oluştu"));
      },
    });
  });
};

/**
 * Excel dosyasını ayrıştırır
 * @param {string} fileData - Dosya içeriği
 * @returns {Array} - Ayrıştırılmış veri
 */
export const parseExcel = (fileData) => {
  try {
    const workbook = XLSX.read(fileData, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to array of arrays (not objects yet, since we don't know the headers)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data && data.length > 0) {
      return data;
    } else {
      throw new Error("Dosya boş veya geçersiz bir format içeriyor");
    }
  } catch (error) {
    console.error("Excel parse error:", error);
    throw new Error("Excel dosyası okunurken bir hata oluştu");
  }
};

/**
 * Dosyayı türüne göre ayrıştırır
 * @param {File} file - Yüklenen dosya
 * @param {Function} onSuccess - Başarı durumunda çağrılacak fonksiyon
 * @param {Function} onError - Hata durumunda çağrılacak fonksiyon
 */
export const parseFile = (file, onSuccess, onError) => {
  const reader = new FileReader();

  reader.onload = async (e) => {
    const fileData = e.target.result;
    const extension = file.name.split(".").pop()?.toLowerCase();

    try {
      let data;
      if (extension === "csv") {
        data = await parseCSV(fileData);
      } else if (extension === "xlsx" || extension === "xls") {
        data = parseExcel(fileData);
      } else {
        throw new Error("Desteklenmeyen dosya formatı");
      }

      onSuccess(data);
    } catch (error) {
      onError(error);
    }
  };

  reader.onerror = () => {
    onError(new Error("Dosya okunurken bir hata oluştu"));
  };

  if (file.name.endsWith(".csv")) {
    reader.readAsText(file);
  } else {
    reader.readAsBinaryString(file);
  }
};
