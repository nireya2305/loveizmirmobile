import React, { createContext, useCallback, useContext } from "react";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  source?: string;
  url?: string;
  publishedAt?: string;
};

type NewsState = {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  available: boolean;
  refresh: () => Promise<void>;
};

const UNAVAILABLE_MESSAGE =
  "Doğrulanmış haber kaynağı henüz bağlı değil. Resmi İzmir bağlantılarını kullanabilirsiniz.";
const NO_NEWS: NewsItem[] = [];
const NewsContext = createContext<NewsState | null>(null);

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const refresh = useCallback(async () => {
    // Fail closed until a verified, source-backed newsroom feed is connected.
  }, []);

  return (
    <NewsContext.Provider
      value={{
        items: NO_NEWS,
        loading: false,
        error: UNAVAILABLE_MESSAGE,
        lastUpdated: null,
        available: false,
        refresh,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error("useNews must be used inside NewsProvider");
  return ctx;
}
