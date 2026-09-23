import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentWeather } from "@workspace/api-client-react";

export type IzmirWeather = {
  temperatureC: number;
  weatherCode: number;
  isDay: boolean;
  sunsetISO: string | null;
  fetchedAt: number;
  stale: boolean;
  source: "LIVE_PROVIDER" | "SERVER_CACHE" | "STALE_CACHE" | "DEVICE_CACHE";
};

const STORAGE_KEY = "loveizmir.weather.v1";
const TTL_MS = 30 * 60 * 1000;

export function istanbulDayKey(d: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    // Fallback: approximate Istanbul (UTC+3, no DST)
    const shifted = new Date(d.getTime() + 3 * 60 * 60 * 1000);
    return shifted.toISOString().slice(0, 10);
  }
}

async function readCache(): Promise<IzmirWeather | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Partial<IzmirWeather>;
    if (typeof obj?.fetchedAt !== "number") return null;
    if (
      typeof obj.temperatureC !== "number" ||
      typeof obj.weatherCode !== "number" ||
      typeof obj.isDay !== "boolean"
    )
      return null;
    return {
      temperatureC: obj.temperatureC,
      weatherCode: obj.weatherCode,
      isDay: obj.isDay,
      sunsetISO: typeof obj.sunsetISO === "string" ? obj.sunsetISO : null,
      fetchedAt: obj.fetchedAt,
      stale: obj.stale ?? true,
      source: obj.source ?? "DEVICE_CACHE",
    };
  } catch {
    return null;
  }
}

export async function fetchIzmirWeather(
  force = false,
): Promise<IzmirWeather | null> {
  if (!force) {
    const cached = await readCache();
    if (cached && Date.now() - cached.fetchedAt < TTL_MS) return cached;
  }
  try {
    const data = await getCurrentWeather();
    const out: IzmirWeather = {
      temperatureC: data.temperatureC,
      weatherCode: data.weatherCode,
      isDay: data.isDay,
      sunsetISO: data.sunsetISO,
      fetchedAt: Date.parse(data.observedAt) || Date.now(),
      stale: data.stale,
      source: data.source,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    } catch {
      // ignore
    }
    return out;
  } catch {
    const cached = await readCache();
    return cached ? { ...cached, stale: true, source: "DEVICE_CACHE" } : null;
  }
}

export function weatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code >= 1 && code <= 3) return isDay ? "⛅" : "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}

export function weatherLabel(code: number): string {
  if (code === 0) return "Açık";
  if (code <= 3) return "Parçalı bulutlu";
  if (code <= 48) return "Sisli";
  if (code <= 67) return "Yağmurlu";
  if (code <= 77) return "Karlı";
  if (code <= 82) return "Sağanak";
  return "Fırtınalı";
}

export function isRainy(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
}
