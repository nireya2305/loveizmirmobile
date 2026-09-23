export type BadgeInput = {
  score: number;
  visitedCount: number;
  memoriesCount: number;
  districts: Record<string, number>;
  modes: Record<string, number>;
  chatCount: number;
  sunsetViewCount: number;
};

export type Badge = {
  id: string;
  emoji: string;
  name: string;
  hint: string;
  category: "explorer" | "vibe" | "ai" | "love";
  unlocked: (i: BadgeInput) => boolean;
  progress: (i: BadgeInput) => { current: number; target: number };
};

function clamp(n: number): number {
  return n < 0 ? 0 : n;
}

export const BADGES: Badge[] = [
  {
    id: "first-step",
    emoji: "🌱",
    name: "İlk Adım",
    hint: "Loveİzmir'e ilk dokunuş",
    category: "love",
    unlocked: (i) => i.score >= 5,
    progress: (i) => ({ current: Math.min(i.score, 5), target: 5 }),
  },
  {
    id: "sunset-hunter",
    emoji: "🌅",
    name: "Gün Batımı Avcısı",
    hint: "3 farklı günde gün batımı an'ı yakala",
    category: "vibe",
    unlocked: (i) => i.sunsetViewCount >= 3,
    progress: (i) => ({ current: Math.min(i.sunsetViewCount, 3), target: 3 }),
  },
  {
    id: "vineyard-soul",
    emoji: "🍇",
    name: "Bağ Ruhu — Urla",
    hint: "Urla'yı 2 kez keşfet",
    category: "explorer",
    unlocked: (i) => (i.districts.urla ?? 0) >= 2,
    progress: (i) => ({
      current: Math.min(i.districts.urla ?? 0, 2),
      target: 2,
    }),
  },
  {
    id: "marina-spirit",
    emoji: "⛵",
    name: "Marina Ruhu — Çeşme",
    hint: "Çeşme'yi 2 kez keşfet",
    category: "explorer",
    unlocked: (i) => (i.districts.cesme ?? 0) >= 2,
    progress: (i) => ({
      current: Math.min(i.districts.cesme ?? 0, 2),
      target: 2,
    }),
  },
  {
    id: "alacati-luxe",
    emoji: "✨",
    name: "Alaçatı Lüksü",
    hint: "Alaçatı'yı 2 kez keşfet",
    category: "explorer",
    unlocked: (i) => (i.districts.alacati ?? 0) >= 2,
    progress: (i) => ({
      current: Math.min(i.districts.alacati ?? 0, 2),
      target: 2,
    }),
  },
  {
    id: "foca-artist",
    emoji: "🎨",
    name: "Sanatçı Foça",
    hint: "Foça'nın sakin sanat sahiline uğra",
    category: "explorer",
    unlocked: (i) => (i.districts.foca ?? 0) >= 1,
    progress: (i) => ({
      current: Math.min(i.districts.foca ?? 0, 1),
      target: 1,
    }),
  },
  {
    id: "kemeralti-bazaar",
    emoji: "🕌",
    name: "Kemeraltı Çırağı",
    hint: "Kemeraltı modunu kullan",
    category: "vibe",
    unlocked: (i) => (i.modes.kemeralti ?? 0) >= 1,
    progress: (i) => ({
      current: Math.min(i.modes.kemeralti ?? 0, 1),
      target: 1,
    }),
  },
  {
    id: "gastro-traveler",
    emoji: "🍽️",
    name: "Gastro Gezgin",
    hint: "Gastro modunda 3 sohbet",
    category: "vibe",
    unlocked: (i) => (i.modes.gastro ?? 0) >= 3,
    progress: (i) => ({
      current: Math.min(i.modes.gastro ?? 0, 3),
      target: 3,
    }),
  },
  {
    id: "city-explorer",
    emoji: "🗺️",
    name: "Şehir Kâşifi",
    hint: "Profil'e 3 yer ekle",
    category: "explorer",
    unlocked: (i) => i.visitedCount >= 3,
    progress: (i) => ({ current: Math.min(i.visitedCount, 3), target: 3 }),
  },
  {
    id: "memory-keeper",
    emoji: "📖",
    name: "Hatıra Yazarı",
    hint: "İlk anınızı kaydet",
    category: "love",
    unlocked: (i) => i.memoriesCount >= 1,
    progress: (i) => ({ current: Math.min(i.memoriesCount, 1), target: 1 }),
  },
  {
    id: "ai-friend",
    emoji: "💬",
    name: "AI Dostu",
    hint: "5 ayrı gün Master AI ile sohbet et",
    category: "ai",
    unlocked: (i) => i.chatCount >= 5,
    progress: (i) => ({ current: Math.min(i.chatCount, 5), target: 5 }),
  },
  {
    id: "izmir-lover",
    emoji: "❤️",
    name: "İzmir Sevdalısı",
    hint: "150 sevda puanı",
    category: "love",
    unlocked: (i) => i.score >= 150,
    progress: (i) => ({ current: Math.min(i.score, 150), target: 150 }),
  },
  {
    id: "izmir-legend",
    emoji: "👑",
    name: "İzmir Efsanesi",
    hint: "800 sevda puanı",
    category: "love",
    unlocked: (i) => i.score >= 800,
    progress: (i) => ({ current: Math.min(i.score, 800), target: 800 }),
  },
];

export function evaluateBadges(i: BadgeInput): {
  unlocked: Badge[];
  locked: Badge[];
  total: number;
  unlockedCount: number;
} {
  const unlocked: Badge[] = [];
  const locked: Badge[] = [];
  for (const b of BADGES) {
    if (b.unlocked(i)) unlocked.push(b);
    else locked.push(b);
  }
  return {
    unlocked,
    locked,
    total: BADGES.length,
    unlockedCount: clamp(unlocked.length),
  };
}
