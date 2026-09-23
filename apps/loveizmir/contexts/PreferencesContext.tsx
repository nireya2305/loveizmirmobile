import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getJSON, setJSON } from "@/lib/storage";

const STORAGE_KEY = "loveizmir.prefs.v1";

type Counts = Record<string, number>;

type PrefsState = {
  districts: Counts;
  modes: Counts;
};

const EMPTY: PrefsState = { districts: {}, modes: {} };

type PrefsValue = {
  state: PrefsState;
  trackDistrict: (key: string) => void;
  trackMode: (key: string) => void;
  summary: string;
  reset: () => void;
};

const PreferencesContext = createContext<PrefsValue | null>(null);

function top(counts: Counts, n: number): string[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function buildSummary(s: PrefsState): string {
  const tD = top(s.districts, 3);
  const tM = top(s.modes, 3);
  if (!tD.length && !tM.length) return "";
  const lines: string[] = ["KULLANICI TERCİH PROFİLİ (hyper-personalization):"];
  if (tD.length) lines.push(`- En çok ilgilendiği ilçeler: ${tD.join(", ")}`);
  if (tM.length) lines.push(`- En çok kullandığı modlar: ${tM.join(", ")}`);
  lines.push(
    "Cevaplarken bu profili sezgisel olarak hesaba kat — açıkça 'profilinde X var' deme.",
  );
  return lines.join("\n");
}

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<PrefsState>(EMPTY);
  const ref = useRef<PrefsState>(EMPTY);
  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await getJSON<PrefsState>(STORAGE_KEY);
      if (cancelled) return;
      const live = ref.current;
      if (stored) {
        const mergeCounts = (a: Counts, b: Counts): Counts => {
          const out: Counts = { ...a };
          for (const [k, v] of Object.entries(b)) {
            out[k] = (out[k] ?? 0) + v;
          }
          return out;
        };
        const merged: PrefsState = {
          districts: mergeCounts(stored.districts ?? {}, live.districts),
          modes: mergeCounts(stored.modes ?? {}, live.modes),
        };
        ref.current = merged;
        setState(merged);
      }
      hydrated.current = true;
      // flush any pre-hydration mutations (or stored merge) to disk
      void setJSON(STORAGE_KEY, ref.current);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: PrefsState) => {
    ref.current = next;
    setState(next);
    if (hydrated.current) void setJSON(STORAGE_KEY, next);
  }, []);

  const trackDistrict = useCallback(
    (key: string) => {
      const cur = ref.current;
      persist({
        ...cur,
        districts: { ...cur.districts, [key]: (cur.districts[key] ?? 0) + 1 },
      });
    },
    [persist],
  );

  const trackMode = useCallback(
    (key: string) => {
      const cur = ref.current;
      persist({
        ...cur,
        modes: { ...cur.modes, [key]: (cur.modes[key] ?? 0) + 1 },
      });
    },
    [persist],
  );

  const reset = useCallback(() => persist(EMPTY), [persist]);

  const summary = useMemo(() => buildSummary(state), [state]);

  const value = useMemo<PrefsValue>(
    () => ({ state, trackDistrict, trackMode, summary, reset }),
    [state, trackDistrict, trackMode, summary, reset],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
