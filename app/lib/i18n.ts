import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "~/locales/en/common.json";
import id from "~/locales/id/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    id: { common: id },
  },
  lng: "en", // LanguageProvider (lib/language.tsx) syncs this to the persisted choice on mount
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: { escapeValue: false }, // React already escapes
});

export default i18n;
