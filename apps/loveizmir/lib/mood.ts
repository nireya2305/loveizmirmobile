import type { LoopCard } from "./dailyLoop";
import { isRainy, type IzmirWeather } from "./weather";

export type Vibe =
  | "rainy-cozy"
  | "sunny-beach"
  | "golden-hour"
  | "weekend-buildup"
  | "tonight"
  | "calm-sunday"
  | "morning-fresh"
  | "default";

export type CityEnergy = "sakin" | "keyifli" | "hareketli" | "canlı";

export type MoodSnapshot = {
  vibe: Vibe;
  emoji: string;
  greeting: string;
  oneLiner: string;
  energy: CityEnergy;
  gradient: [string, string];
  categoryBias: LoopCard["category"][];
  aiPrompt: string;
};

const DEFAULT_BIAS: LoopCard["category"][] = [
  "gastro",
  "sunset",
  "evening",
  "weekend",
  "cesme",
  "urla",
];

export function partOfDay(h: number): "dawn" | "morning" | "noon" | "afternoon" | "evening" | "night" {
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "noon";
  if (h >= 16 && h < 19) return "afternoon";
  if (h >= 19 && h < 23) return "evening";
  return "night";
}

export function deriveMood(opts: {
  now?: Date;
  weather: IzmirWeather | null;
  sunsetDate: Date | null;
}): MoodSnapshot {
  const now = opts.now ?? new Date();
  const h = now.getHours();
  const dow = now.getDay(); // 0=Sun, 5=Fri, 6=Sat
  const pod = partOfDay(h);
  const code = opts.weather?.weatherCode ?? 0;
  const temp = opts.weather?.temperatureC ?? 22;
  const isDay = opts.weather?.isDay ?? (h >= 7 && h < 20);
  const rainy = isRainy(code);

  // Golden hour: within 75min before & 25min after sunset
  let goldenHour = false;
  if (opts.sunsetDate) {
    const diffMs = opts.sunsetDate.getTime() - now.getTime();
    goldenHour = diffMs <= 75 * 60 * 1000 && diffMs >= -25 * 60 * 1000;
  }

  if (rainy) {
    return {
      vibe: "rainy-cozy",
      emoji: "🌧️",
      greeting: pod === "morning" || pod === "dawn"
        ? "Günaydın · İzmir bugün yağmurlu ve şiirsel"
        : "Yağmurlu İzmir · sıcak köşeler için tam zamanı",
      oneLiner:
        "Bir Urla kafesi, jazz çalan bir bar, ya da küçük bir sinema — bugün şehir içeride güzel.",
      energy: "sakin",
      gradient: ["#0c4a6e", "#475569"],
      categoryBias: ["gastro", "quote", "urla", "ai", "evening"],
      aiPrompt:
        "Bugün İzmir yağmurlu. Sıcak köşeler için 3 spesifik öneri: butik kafe, jazz/canlı müzik mekanı, sanat sineması. Konum + neden seçildiği.",
    };
  }

  if (goldenHour) {
    return {
      vibe: "golden-hour",
      emoji: "🌅",
      greeting: "Altın saat başlıyor · İzmir şu an çok güzel",
      oneLiner: "Gün batımı için hâlâ vakit var. Bugün en iyi nokta nere?",
      energy: "keyifli",
      gradient: ["#ff6b6b", "#ffa07a"],
      categoryBias: ["sunset", "evening", "cesme", "gastro", "ai"],
      aiPrompt:
        "Gün batımına yakın saat. İzmir'de bu akşam için en iyi 3 sunset noktası: konum, neden, yanında ne içilir/yenir, fotoğraf ipucu.",
    };
  }

  const weekendBuildupEarly =
    (dow === 4 && (pod === "evening" || pod === "afternoon")) ||
    (dow === 5 && (pod === "afternoon" || pod === "evening"));
  if (weekendBuildupEarly) {
    return {
      vibe: "weekend-buildup",
      emoji: "🎉",
      greeting: "Hafta sonu yaklaşıyor · Weekend Guide hazır",
      oneLiner: "Çeşme, Urla, Alaçatı, Sığacık — bu hafta sonu nereye?",
      energy: "hareketli",
      gradient: ["#ff6b6b", "#0e7490"],
      categoryBias: ["weekend", "cesme", "urla", "gastro", "ai"],
      aiPrompt:
        "Bu hafta sonu İzmir çevresi için 3 farklı plan: Çeşme-Alaçatı, Urla-Sığacık, Foça veya Şirince. Saatlik program + konaklama önerisi.",
    };
  }

  if (pod === "evening" || pod === "night") {
    return {
      vibe: "tonight",
      emoji: "🌙",
      greeting: "Bu akşam İzmir'de · Tonight in İzmir",
      oneLiner:
        "Meze rotası mı, canlı müzik mi, sahil yürüyüşü mü — locals bu akşam nereye gidiyor?",
      energy: "hareketli",
      gradient: ["#0e7490", "#7c3aed"],
      categoryBias: ["evening", "gastro", "cesme", "urla", "ai"],
      aiPrompt:
        "Bu akşam İzmir'de yapılacak 3 somut alternatif: meyhane/meze rotası, canlı müzik, sahil bar. Her biri için konum, fiyat aralığı ve neden gidilmeli.",
    };
  }

  if (pod === "dawn" || pod === "morning") {
    if (dow === 0) {
      return {
        vibe: "calm-sunday",
        emoji: "☕",
        greeting: "Pazar sabahı · Yavaş başlayalım",
        oneLiner:
          "Sakin bir kahvaltı, sanat rotası ve akşamüstü bir yürüyüş — bugünün ritmi yumuşak.",
        energy: "sakin",
        gradient: ["#0e7490", "#fbbf24"],
        categoryBias: ["gastro", "quote", "weekend", "urla", "ai"],
        aiPrompt:
          "Pazar İzmir'i için sakin bir günlük plan: yavaş kahvaltı, müze/galeri, akşamüstü yürüyüş. Yer ve saatler ile.",
      };
    }
    return {
      vibe: "morning-fresh",
      emoji: "☀️",
      greeting: `Günaydın · İzmir bugün ${weatherWord(code, temp)}`,
      oneLiner:
        "Boyoz, gevrek ve körfez kokusu — güne nasıl başlamalı?",
      energy: "keyifli",
      gradient: ["#0e7490", "#06b6d4"],
      categoryBias: ["gastro", "weekend", "ai", "sunset", "urla"],
      aiPrompt:
        "Bugün İzmir için sabahtan akşama uzanan bir günlük plan öner. Kahvaltı, kültür, öğle yemeği ve gün batımı dahil.",
    };
  }

  if (isDay && !rainy && temp >= 22 && (dow === 6 || dow === 0)) {
    return {
      vibe: "sunny-beach",
      emoji: "🏖️",
      greeting: "Güneşli bir gün · Deniz çağırıyor",
      oneLiner: `${Math.round(temp)}°C · plaj, marina ve sahil rotası için ideal.`,
      energy: "canlı",
      gradient: ["#06b6d4", "#fbbf24"],
      categoryBias: ["cesme", "urla", "sunset", "evening", "ai"],
      aiPrompt:
        "Bugün güneşli ve sıcak. İzmir çevresinde 3 farklı plaj/sahil önerisi: kalabalık olmayan, ulaşım kolay, yanında lokanta olan.",
    };
  }

  return {
    vibe: "default",
    emoji: "❤️",
    greeting: "İzmir · şehre yeniden hoş geldin",
    oneLiner: `${Math.round(temp)}°C · ${weatherWord(code, temp)}. Günün ritmine göre öneriler aşağıda.`,
    energy: "keyifli",
    gradient: ["#0e7490", "#ff6b6b"],
    categoryBias: DEFAULT_BIAS,
    aiPrompt:
      "Şu anki saate, mevsime ve havaya göre İzmir'de yapabileceğim 3 spesifik şey öner.",
  };
}

function weatherWord(code: number, temp: number): string {
  if (isRainy(code)) return "yağmurlu";
  if (code === 0 && temp >= 28) return "sıcak ve açık";
  if (code === 0) return "açık ve berrak";
  if (code <= 3) return "parçalı bulutlu";
  if (code <= 48) return "sisli";
  return "değişken";
}

export function parseSunset(sunsetISO: string | null): Date | null {
  if (!sunsetISO) return null;
  // Open-meteo returns local time without offset; treat as Istanbul local
  // Robust parse: if no Z/+, append +03:00 (Istanbul)
  const hasOffset = /Z|[+-]\d{2}:\d{2}$/.test(sunsetISO);
  const d = new Date(hasOffset ? sunsetISO : `${sunsetISO}:00+03:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function formatCountdown(msUntil: number): string {
  if (msUntil <= 0) return "şimdi";
  const total = Math.floor(msUntil / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h >= 1) return `${h}sa ${m}dk`;
  return `${m}dk`;
}
