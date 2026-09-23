import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RTL_LANGUAGES,
  SUPPORTED_LANGUAGES,
  translate,
  type LanguageCode,
  type TranslationKey,
} from "@/lib/i18n";
import { getString, setString } from "@/lib/storage";

const STORAGE_KEY = "loveizmir.language.v1";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

function isValidLang(code: string | null): code is LanguageCode {
  if (!code) return false;
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("tr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getString(STORAGE_KEY);
      if (!cancelled && isValidLang(stored)) {
        setLanguageState(stored);
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    void setString(STORAGE_KEY, code);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(language, key),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      isRTL: RTL_LANGUAGES.includes(language),
      ready,
    }),
    [language, setLanguage, t, ready],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function useT(): (key: TranslationKey) => string {
  return useLanguage().t;
}
