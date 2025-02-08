import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Locize from "i18next-locize-backend";
import { locizePlugin } from "locize";

const locizeOptions = {
  referenceLng: "tr",
  projectId: "f07b7de3-164a-4335-9476-ebc64fbac570",
};

i18n.use(initReactI18next).init({
  interpolation: {
    escapeValue: false,
  },
});

i18n
  .use(locizePlugin)
  .use(Locize)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
      convertDetectedLanguage: (lng) =>
        lng.indexOf("-") > -1 ? lng.toLowerCase().split("-")[0] : lng,
    },
    backend: locizeOptions,
    react: {
      useSuspense: false,
    },
    saveMissing: true,
  });

export default i18n;
