// FOMO Engine — "Şu an İzmir'de" canlı an üreteci.
// Mood + saat + hava + gün ile filtrelenen seçilmiş anlar.

import type { MoodSnapshot } from "@/lib/mood";

export type FomoMoment = {
  id: string;
  emoji: string;
  district: string;
  title: string;        // 1-line headline
  detail: string;       // short context
  gradient: [string, string];
  aiPrompt: string;     // tap → Master AI
};

type Ctx = {
  mood: MoodSnapshot;
  hour: number;         // 0-23 Istanbul-local
  day: number;          // 0=Sun..6=Sat Istanbul-local
  msToSunset: number | null;
};

// Tüm potansiyel anlar — her birinin kendi "uygunluk" testi var.
type Candidate = {
  test: (ctx: Ctx) => boolean;
  build: () => FomoMoment;
};

const C: Candidate[] = [
  {
    test: ({ msToSunset }) =>
      msToSunset !== null && msToSunset > 0 && msToSunset < 90 * 60 * 1000,
    build: () => ({
      id: "sunset-asansor",
      emoji: "🌅",
      district: "Konak",
      title: "Asansör'de golden hour başladı",
      detail: "Karataş Asansör terasında deniz altın rengi · şu an",
      gradient: ["#f97316", "#ff6b6b"],
      aiPrompt:
        "Karataş Asansör çevresinde gün batımı için en iyi 3 nokta ve hemen sonrasında nereye geçilmeli — somut plan ver.",
    }),
  },
  {
    test: ({ msToSunset }) =>
      msToSunset !== null && msToSunset > 0 && msToSunset < 60 * 60 * 1000,
    build: () => ({
      id: "sunset-kordon",
      emoji: "💛",
      district: "Alsancak",
      title: "Kordon'da deniz turuncuya dönüyor",
      detail: "Sahil yürüyüşü için altın saat · 60dk içinde batım",
      gradient: ["#fbbf24", "#ff6b6b"],
      aiPrompt:
        "Kordon'da gün batımı yürüyüşü ve hemen ardından akşam yemeği için bir mini rota öner.",
    }),
  },
  {
    test: ({ hour, day }) =>
      (day === 5 || day === 6) && hour >= 18 && hour <= 23,
    build: () => ({
      id: "alacati-night",
      emoji: "🎶",
      district: "Alaçatı",
      title: "Hacımemiş'te canlı müzik başlıyor",
      detail: "Cumartesi gecesi yüksek enerji · taş sokaklar dolu",
      gradient: ["#ff6b6b", "#7c3aed"],
      aiPrompt:
        "Alaçatı Hacımemiş çevresinde bu gece için 1 yemek + 1 bar + 1 gece kulübü rotası kur. Rezervasyon zorluğunu da söyle.",
    }),
  },
  {
    test: ({ day, hour }) =>
      (day === 0 || day === 6) && hour >= 9 && hour <= 12,
    build: () => ({
      id: "urla-vineyard",
      emoji: "🍇",
      district: "Urla",
      title: "Bağ yolu pazarda açık",
      detail: "Hafta sonu sabahı şarap tadımı için en uygun zaman",
      gradient: ["#0e7490", "#7c3aed"],
      aiPrompt:
        "Bugün Urla bağ yolunda 3 bağ + öğlen bir şef restoranı rotası kur. Saat saat plan ver.",
    }),
  },
  {
    test: ({ hour }) => hour >= 6 && hour <= 10,
    build: () => ({
      id: "boyoz-morning",
      emoji: "🥐",
      district: "Konak",
      title: "Dostlar Fırını'nda sıcak boyoz",
      detail: "Karataş sabahları · taze çıktı, en yoğun saatler",
      gradient: ["#fbbf24", "#ff6b6b"],
      aiPrompt:
        "İzmir'in en iyi boyoz noktalarını ve hemen yanında Türk kahvesi içilecek yerleri sırala.",
    }),
  },
  {
    test: ({ hour, day }) =>
      (day === 0 || day === 6) && hour >= 8 && hour <= 12,
    build: () => ({
      id: "yelki-breakfast",
      emoji: "🌿",
      district: "Güzelbahçe",
      title: "Yelki Köy kahvaltısı tam zamanı",
      detail: "Yavaş hafta sonu, doğa ile · masalar hızla doluyor",
      gradient: ["#0e7490", "#fbbf24"],
      aiPrompt:
        "Yelki Köy ve Urla zeytinli yolda en iyi 3 köy kahvaltı yeri, masaların ne zaman dolduğu ve hangi tabakları söylemeli.",
    }),
  },
  {
    test: ({ mood, hour }) =>
      mood.vibe === "rainy-cozy" && hour >= 11 && hour <= 22,
    build: () => ({
      id: "rainy-cafe",
      emoji: "☕",
      district: "Alsancak",
      title: "Yağmurda Alsancak kafe saati",
      detail: "1453 Sokak'ta sıcak kahve, kitap, jazz",
      gradient: ["#0c4a6e", "#7c3aed"],
      aiPrompt:
        "Yağmurlu bir gün için Alsancak'ta sıcak, sakin ve özel 3 kafe öner — ambiyans ve neden farklı oldukları ile.",
    }),
  },
  {
    test: ({ hour, day, mood }) =>
      mood.vibe !== "rainy-cozy" && hour >= 11 && hour <= 17 && day !== 1,
    build: () => ({
      id: "cesme-marina",
      emoji: "⚓",
      district: "Çeşme",
      title: "Çeşme Marina'da yatlar hareketleniyor",
      detail: "Günübirlik turlar, marina kafe terasları açık",
      gradient: ["#06b6d4", "#0e7490"],
      aiPrompt:
        "Bugün Çeşme Marina'dan kalkan günübirlik yat turları, marina restoranları ve sunset için en iyi sıralamayı ver.",
    }),
  },
  {
    test: ({ hour, day }) => day >= 1 && day <= 4 && hour >= 19 && hour <= 23,
    build: () => ({
      id: "alsancak-meyhane",
      emoji: "🍷",
      district: "Alsancak",
      title: "1888'de meyhane gecesi",
      detail: "Tarihi meyhane, klasik İzmir mezeleri · sakin akşam",
      gradient: ["#7c3aed", "#ff6b6b"],
      aiPrompt:
        "Alsancak meyhane kültüründe en otantik 3 mekan, hangi mezeler ve hangi rakı/şarap eşleştirmesi.",
    }),
  },
  {
    test: ({ hour }) => hour >= 13 && hour <= 17,
    build: () => ({
      id: "karaburun-secret",
      emoji: "🏝️",
      district: "Karaburun",
      title: "Sarpıncık'ta koylar tenha",
      detail: "Yarımadanın gizli tarafı · iki saatlik kaçış",
      gradient: ["#0e7490", "#06b6d4"],
      aiPrompt:
        "Karaburun yarımadasında turist olmayan, yerel sahil ve restoran rotası kur — kaç saatlik bir günübirlik kaçış.",
    }),
  },
  {
    test: ({ hour, mood }) =>
      mood.vibe !== "rainy-cozy" && hour >= 7 && hour <= 11,
    build: () => ({
      id: "bostanli-walk",
      emoji: "🚶",
      district: "Bostanlı",
      title: "Bostanlı sahilinde sabah yürüyüşü",
      detail: "Karşıyaka sahili sakin · vapur trafiği başlamadan",
      gradient: ["#06b6d4", "#fbbf24"],
      aiPrompt:
        "Bostanlı-Karşıyaka sahil yürüyüşü ardından nerelerde kahvaltı yapabilirim — sahile yakın 3 mekan ve hangi saatte gidilmeli.",
    }),
  },
  {
    test: ({ hour, day }) =>
      (day === 5 || day === 6) && hour >= 12 && hour <= 16,
    build: () => ({
      id: "kemeralti-han",
      emoji: "🏺",
      district: "Kemeraltı",
      title: "Kızlarağası Hanı'nda hafta sonu kalabalığı",
      detail: "Antika, kahve, esnaf · saat 14-16 en hareketli",
      gradient: ["#fbbf24", "#ff6b6b"],
      aiPrompt:
        "Kemeraltı'nın gizli hanlarında 2 saatlik bir keşif rotası — Kızlarağası, Çakaloğlu ve içlerindeki en özel dükkanlar.",
    }),
  },
  {
    test: () => true, // fallback
    build: () => ({
      id: "default-konakpier",
      emoji: "🛍️",
      district: "Konak Pier",
      title: "Pier'de marina yürüyüşü hep güzel",
      detail: "Lüks markalar, sunset masaları, Pasaport yakını",
      gradient: ["#0e7490", "#06b6d4"],
      aiPrompt:
        "Konak Pier'de yarım gün için alışveriş + sunset café + akşam yemeği önerisi.",
    }),
  },
];

const ISTANBUL_TZ = "Europe/Istanbul";

function istanbulHourAndDay(now: Date): { hour: number; day: number } {
  // ICU-based — works in RN/Hermes & web.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ISTANBUL_TZ,
    hour: "numeric",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(now);
  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "0";
  const wdPart = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const hour = parseInt(hourPart, 10);
  return {
    hour: Number.isFinite(hour) ? hour % 24 : 0,
    day: dayMap[wdPart] ?? 0,
  };
}

export function getFomoMoments(args: {
  mood: MoodSnapshot;
  now: Date;
  msToSunset: number | null;
}): FomoMoment[] {
  const { hour, day } = istanbulHourAndDay(args.now);
  const ctx: Ctx = {
    mood: args.mood,
    hour,
    day,
    msToSunset: args.msToSunset,
  };
  const out: FomoMoment[] = [];
  const seen = new Set<string>();
  for (const c of C) {
    if (c.test(ctx)) {
      const m = c.build();
      if (!seen.has(m.id)) {
        seen.add(m.id);
        out.push(m);
      }
      if (out.length >= 4) break;
    }
  }
  return out;
}
