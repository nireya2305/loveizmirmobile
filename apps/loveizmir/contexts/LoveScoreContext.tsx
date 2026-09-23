import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { istanbulDayKey } from "@/lib/weather";

export type ScoreAction =
  | "app_open_daily"
  | "card_tap"
  | "sunset_view"
  | "news_read"
  | "place_visited"
  | "memory_added"
  | "chat_used"
  | "share";

const POINTS: Record<ScoreAction, number> = {
  app_open_daily: 5,
  card_tap: 1,
  sunset_view: 3,
  news_read: 2,
  place_visited: 10,
  memory_added: 6,
  chat_used: 2,
  share: 4,
};

const DAILY_LIMITED: Partial<Record<ScoreAction, true>> = {
  app_open_daily: true,
  chat_used: true,
  sunset_view: true,
};

const STORAGE_KEY = "loveizmir.score.v1";

type Persisted = {
  total: number;
  dailyKeys: Record<string, string>; // `${action}@${YYYY-MM-DD}` => "1"
  history: { ts: number; action: ScoreAction; amount: number }[];
};

const EMPTY: Persisted = { total: 0, dailyKeys: {}, history: [] };

export type LoveLevel = {
  index: number; // 0..4
  name: string;
  emoji: string;
  minScore: number;
  nextAt: number | null;
};

const LEVELS: { name: string; emoji: string; minScore: number }[] = [
  { name: "Yeni Sevdalı", emoji: "🌱", minScore: 0 },
  { name: "Gezgin", emoji: "🚶", minScore: 50 },
  { name: "Yerel", emoji: "🌊", minScore: 150 },
  { name: "Tanıdık", emoji: "⭐", minScore: 400 },
  { name: "İzmir Efsanesi", emoji: "❤️", minScore: 800 },
];

export function levelFor(score: number): LoveLevel {
  let idx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i]!.minScore) {
      idx = i;
      break;
    }
  }
  const next = LEVELS[idx + 1];
  return {
    index: idx,
    name: LEVELS[idx]!.name,
    emoji: LEVELS[idx]!.emoji,
    minScore: LEVELS[idx]!.minScore,
    nextAt: next ? next.minScore : null,
  };
}

type Ctx = {
  ready: boolean;
  score: number;
  level: LoveLevel;
  recent: { ts: number; action: ScoreAction; amount: number }[];
  award: (action: ScoreAction) => number; // returns awarded points (0 if skipped)
  /** Number of distinct days the action was performed (only meaningful for daily-limited actions). */
  daysWithAction: (action: ScoreAction) => number;
};

const LoveScoreContext = createContext<Ctx | null>(null);

function todayKey(d = new Date()): string {
  return istanbulDayKey(d);
}

export function LoveScoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Persisted>(EMPTY);
  const [ready, setReady] = useState(false);
  const persistRef = useRef<Persisted>(EMPTY);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && alive) {
          const parsed = JSON.parse(raw) as Persisted;
          const next: Persisted = {
            total: typeof parsed.total === "number" ? parsed.total : 0,
            dailyKeys: parsed.dailyKeys ?? {},
            history: Array.isArray(parsed.history) ? parsed.history.slice(-50) : [],
          };
          setData(next);
          persistRef.current = next;
        }
      } catch {
        // ignore
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback(async (next: Persisted) => {
    persistRef.current = next;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const award = useCallback(
    (action: ScoreAction): number => {
      const amount = POINTS[action] ?? 0;
      if (amount <= 0) return 0;
      const current = persistRef.current;
      let dailyKeys = current.dailyKeys;
      if (DAILY_LIMITED[action]) {
        const k = `${action}@${todayKey()}`;
        if (current.dailyKeys[k]) return 0;
        dailyKeys = { ...current.dailyKeys, [k]: "1" };
      }
      const next: Persisted = {
        total: current.total + amount,
        dailyKeys,
        history: [
          ...current.history,
          { ts: Date.now(), action, amount },
        ].slice(-50),
      };
      setData(next);
      void persist(next);
      return amount;
    },
    [persist],
  );

  // Award once-per-day open on first ready
  const openedRef = useRef(false);
  useEffect(() => {
    if (!ready || openedRef.current) return;
    openedRef.current = true;
    award("app_open_daily");
  }, [ready, award]);

  const level = levelFor(data.total);
  const recent = data.history.slice(-10).reverse();

  const daysWithAction = useCallback(
    (action: ScoreAction): number => {
      const prefix = `${action}@`;
      let n = 0;
      for (const k of Object.keys(data.dailyKeys)) {
        if (k.startsWith(prefix)) n++;
      }
      return n;
    },
    [data.dailyKeys],
  );

  return (
    <LoveScoreContext.Provider
      value={{ ready, score: data.total, level, recent, award, daysWithAction }}
    >
      {children}
    </LoveScoreContext.Provider>
  );
}

export function useLoveScore(): Ctx {
  const ctx = useContext(LoveScoreContext);
  if (!ctx) throw new Error("useLoveScore must be used inside LoveScoreProvider");
  return ctx;
}
