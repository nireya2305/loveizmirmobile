import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { apiFetch } from "@/lib/apiClient";

export type ListingCat = "boat" | "car" | "stay";

export type Listing = {
  id: string;
  title: string;
  provider?: string;
  type?: string;
  location?: string;
  priceFrom?: string;
  features: string[];
  description?: string;
  source?: string;
  url?: string;
};

type CatState = {
  items: Listing[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
};

type ListingsValue = {
  data: Record<ListingCat, CatState>;
  refresh: (cat: ListingCat) => Promise<void>;
};

const ONE_HOUR_MS = 60 * 60 * 1000;
const STORAGE_PREFIX = "loveizmir.listings.v2.";

const ListingsContext = createContext<ListingsValue | null>(null);

type BackendListing = {
  id: string;
  category: string;
  title: string;
  provider: string | null;
  priceFrom: string | null;
  location: string | null;
  contact: string | null;
  description: string | null;
  listingType: string | null;
  status: string;
  createdAt: string;
};

function adaptListing(row: BackendListing): Listing {
  return {
    id: row.id,
    title: row.title,
    provider: row.provider ?? undefined,
    type: row.listingType ?? undefined,
    location: row.location ?? undefined,
    priceFrom: row.priceFrom ?? undefined,
    features: [],
    description: row.description ?? undefined,
    source: undefined,
    url: undefined,
  };
}

const EMPTY: CatState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<ListingCat, CatState>>({
    boat: EMPTY,
    car: EMPTY,
    stay: EMPTY,
  });
  const inFlight = useRef<Record<ListingCat, boolean>>({
    boat: false,
    car: false,
    stay: false,
  });
  const initDone = useRef<boolean>(false);

  const persist = useCallback(
    async (cat: ListingCat, items: Listing[], ts: number) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_PREFIX + cat,
          JSON.stringify({ items, lastUpdated: ts }),
        );
      } catch {
        // ignore
      }
    },
    [],
  );

  const refresh = useCallback(
    async (cat: ListingCat) => {
      if (inFlight.current[cat]) return;
      inFlight.current[cat] = true;
      setData((d) => ({
        ...d,
        [cat]: { ...d[cat], loading: true, error: null },
      }));
      try {
        const res = await apiFetch(`/api/listings?category=${cat}&limit=50`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { items: BackendListing[] };
        const items = (json.items || []).map(adaptListing);
        const ts = Date.now();
        setData((d) => ({
          ...d,
          [cat]: { items, loading: false, error: null, lastUpdated: ts },
        }));
        await persist(cat, items, ts);
      } catch (e) {
        setData((d) => ({
          ...d,
          [cat]: {
            ...d[cat],
            loading: false,
            error: e instanceof Error ? e.message : "İlanlar alınamadı",
          },
        }));
      } finally {
        inFlight.current[cat] = false;
      }
    },
    [persist],
  );

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    (async () => {
      const cats: ListingCat[] = ["boat", "car", "stay"];
      const cachedTs: Partial<Record<ListingCat, number | null>> = {};
      for (const cat of cats) {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_PREFIX + cat);
          if (raw) {
            const d = JSON.parse(raw);
            if (Array.isArray(d?.items)) {
              setData((prev) => ({
                ...prev,
                [cat]: {
                  items: d.items,
                  loading: false,
                  error: null,
                  lastUpdated: d.lastUpdated ?? null,
                },
              }));
              cachedTs[cat] = d.lastUpdated ?? null;
            }
          }
        } catch {
          // ignore
        }
      }
      for (const cat of cats) {
        const ts = cachedTs[cat];
        if (!ts || Date.now() - ts > ONE_HOUR_MS) {
          void refresh(cat);
        }
      }
    })();
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => {
      void refresh("boat");
      void refresh("car");
      void refresh("stay");
    }, ONE_HOUR_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <ListingsContext.Provider value={{ data, refresh }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings(cat: ListingCat) {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used inside ListingsProvider");
  return {
    ...ctx.data[cat],
    refresh: () => ctx.refresh(cat),
  };
}
