import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import fr from './locales/fr';

export const LANGUAGE_STORAGE_KEY = 'hss.language';
export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

function normalizeLanguage(language: string | undefined): SupportedLanguage {
  return language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function updateDocumentLanguage(language: string | undefined) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = normalizeLanguage(language);
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

updateDocumentLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', updateDocumentLanguage);

export { i18n, normalizeLanguage };
