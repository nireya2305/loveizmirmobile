import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState } from "react-native";

import { deriveMood, parseSunset, type MoodSnapshot } from "@/lib/mood";
import { fetchIzmirWeather, type IzmirWeather } from "@/lib/weather";

export type IzmirPulse = {
  now: Date;
  weather: IzmirWeather | null;
  sunsetDate: Date | null;
  msToSunset: number | null;
  pastSunset: boolean;
  mood: MoodSnapshot;
};

const PulseContext = createContext<IzmirPulse | null>(null);

export function PulseProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [weather, setWeather] = useState<IzmirWeather | null>(null);

  useEffect(() => {
    let alive = true;
    const loadWeather = async () => {
      const w = await fetchIzmirWeather();
      if (alive) setWeather(w);
    };
    void loadWeather();
    const minute = setInterval(() => setNow(new Date()), 60 * 1000);
    const refetch = setInterval(() => {
      void loadWeather();
    }, 30 * 60 * 1000);
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") {
        setNow(new Date());
        void loadWeather();
      }
    });
    return () => {
      alive = false;
      clearInterval(minute);
      clearInterval(refetch);
      sub.remove();
    };
  }, []);

  const value = useMemo<IzmirPulse>(() => {
    const sunsetDate = parseSunset(weather?.sunsetISO ?? null);
    const msToSunset = sunsetDate ? sunsetDate.getTime() - now.getTime() : null;
    const pastSunset = msToSunset !== null && msToSunset < -25 * 60 * 1000;
    const mood = deriveMood({ now, weather, sunsetDate });
    return { now, weather, sunsetDate, msToSunset, pastSunset, mood };
  }, [now, weather]);

  return (
    <PulseContext.Provider value={value}>{children}</PulseContext.Provider>
  );
}

export function useIzmirPulse(): IzmirPulse {
  const ctx = useContext(PulseContext);
  if (!ctx)
    throw new Error("useIzmirPulse must be used inside PulseProvider");
  return ctx;
}
