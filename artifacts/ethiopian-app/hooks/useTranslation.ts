import { useApp } from "@/context/AppContext";
import { translations, TranslationKey } from "@/constants/translations/index";

export function useTranslation() {
  const { language, setLanguage } = useApp();
  
  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    const dict = translations[language] as Record<string, string>;
    const enDict = translations.en as Record<string, string>;
    let text = dict[key] || enDict[key] || String(key);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };

  return { t, language, setLanguage };
}
