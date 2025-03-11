import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import JSON Language Files
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import gu from "./locales/gu.json";
import es from "./locales/es.json";
import ar from "./locales/ar.json";  

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
      es: { translation: es },
      ar: { translation: ar },
    },
    fallbackLng: "en",  
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true, 
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute("dir", lng === "ar" ? "rtl" : "ltr");
});

export default i18n;
