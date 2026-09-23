export type Moment =
  | "morning"
  | "noon"
  | "afternoon"
  | "evening"
  | "late";

export type LoopCard = {
  id: string;
  emoji: string;
  category:
    | "gastro"
    | "sunset"
    | "evening"
    | "weekend"
    | "cesme"
    | "urla"
    | "quote"
    | "ai";
  title: string;
  body: string;
  aiPrompt: string;
};

export type MomentMeta = {
  key: Moment;
  kicker: string;
  title: string;
  body: string;
  emoji: string;
  cta: string;
  aiPrompt: string;
};

export function getMoment(d: Date = new Date()): Moment {
  const h = d.getHours();
  if (h >= 6 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "noon";
  if (h >= 16 && h < 20) return "afternoon";
  if (h >= 20 || h < 2) return "evening";
  return "late";
}

const MOMENT_META: Record<Moment, Omit<MomentMeta, "key">> = {
  morning: {
    kicker: "SABAH · MORNING",
    title: "Bugün İzmir'de",
    body: "Güne nereden başlamalı? Boyoz, gevrek ve körfez kokusu — birkaç adım ötede.",
    emoji: "☀️",
    cta: "Bugünün planı",
    aiPrompt:
      "Bugün İzmir için sabahtan akşama uzanan, yürünebilir bir günlük plan öner. Kahvaltı (Boyoz/gevrek), bir kültür durağı, öğle yemeği ve akşamüstü için somut yerler ver.",
  },
  noon: {
    kicker: "ÖĞLE · NOON",
    title: "Günün gastro keşfi",
    body: "Söğüş, kumru, deniz börülcesi, ege otu — bugün öğle paydosu için bir öneri.",
    emoji: "🍴",
    cta: "Nereye gideyim?",
    aiPrompt:
      "İzmir'de öğle yemeği için fiyatı uygun, otantik bir yer öner. Konum, ne yemeli, ortalama fiyat ve nasıl gidilir bilgisini ver.",
  },
  afternoon: {
    kicker: "AKŞAMÜSTÜ · GOLDEN HOUR",
    title: "Gün batımı önerisi",
    body: "Bugünün manzarası: Kordon mu, Kadifekale mi, Çeşme feneri mi?",
    emoji: "🌅",
    cta: "En iyi nokta",
    aiPrompt:
      "Bugün İzmir'de gün batımı için en iyi 3 noktayı sırala. Her biri için neden, nasıl gidilir, yanında ne içilir/yenir ve fotoğraf ipucu ver.",
  },
  evening: {
    kicker: "AKŞAM · TONIGHT",
    title: "Bu akşam nereye gidilir?",
    body: "Alsancak meze rotası mı, Bornova sokak konseri mi, Şirince taverna gecesi mi?",
    emoji: "🌙",
    cta: "Akşamın planı",
    aiPrompt:
      "Bu akşam İzmir'de yapılacak somut 3 alternatif öner: meyhane/meze rotası, canlı müzik mekanı, sahil yürüyüşü + bar. Her biri için konum ve ortalama bütçe.",
  },
  late: {
    kicker: "GECE · LATE",
    title: "İzmir uyumaz",
    body: "Geç saatte açık simitçi, manzaralı seyir noktaları ve sabaha karşı kahveler.",
    emoji: "🌌",
    cta: "Geceyi keşfet",
    aiPrompt:
      "İzmir'de gece geç saatte (00:00 sonrası) açık olan yerler: simitçiler, çorbacılar, manzara seyir noktaları, 24 saat açık kafeler. Konum + nasıl gidilir.",
  },
};

export function getMomentMeta(m: Moment = getMoment()): MomentMeta {
  return { key: m, ...MOMENT_META[m] };
}

const POOL: LoopCard[] = [
  // GASTRO
  {
    id: "gastro-boyoz",
    emoji: "🥐",
    category: "gastro",
    title: "Boyoz & gevrek sabahı",
    body: "Dönertaş Boyozcusu, Kemeraltı'nda. Yanına kaynar Türk çayı.",
    aiPrompt:
      "İzmir'de en otantik boyoz nerede yenir? Sabah saatleri, adres ve neden meşhur olduğunu anlat.",
  },
  {
    id: "gastro-kumru",
    emoji: "🥪",
    category: "gastro",
    title: "Çeşme kumrusu",
    body: "Sucuk, kaşar, domates, sade pide. Sahile bakan herhangi bir bakkalda.",
    aiPrompt:
      "Çeşme kumrusu nedir, en iyi yerlerden 3'ünü öner. Fiyat ve adres ver.",
  },
  {
    id: "gastro-soguş",
    emoji: "🥩",
    category: "gastro",
    title: "İzmir söğüşü",
    body: "Beyin, dil, koyun. Tarihi Kemeraltı'nda eski usul lokantalar.",
    aiPrompt:
      "İzmir söğüşü nedir, hangi lokantada denenmeli? 3 mekan öner.",
  },
  {
    id: "gastro-otlar",
    emoji: "🌿",
    category: "gastro",
    title: "Ege otları",
    body: "Cibez, turpotu, deniz börülcesi, şevketibostan. Mevsiminde mutlaka.",
    aiPrompt:
      "Bu mevsim İzmir'de hangi Ege otları taze? Nerede yenir, nasıl pişirilir?",
  },
  {
    id: "gastro-urla-enginar",
    emoji: "🥬",
    category: "gastro",
    title: "Urla enginarı",
    body: "Zeytinyağlı, limonlu, körfez manzaralı. Urla balık halı çevresi.",
    aiPrompt:
      "Urla'da en iyi enginar yemekleri nerede yenir? Mevsim ve fiyat bilgisi ver.",
  },
  // SUNSET
  {
    id: "sunset-kadifekale",
    emoji: "🏰",
    category: "sunset",
    title: "Kadifekale gün batımı",
    body: "Şehrin üstünden tüm körfez. Çay arabası mutlaka açık.",
    aiPrompt:
      "Kadifekale'ye nasıl gidilir, gün batımı için en iyi saat hangisi? Yanında ne yapılır?",
  },
  {
    id: "sunset-kordon",
    emoji: "🌇",
    category: "sunset",
    title: "Kordon altın saati",
    body: "Pasaport'tan Alsancak'a uzanan klasik. Atlı arabalar geçer.",
    aiPrompt:
      "Kordon'da gün batımı yürüyüşü için en iyi rota ve mola noktaları?",
  },
  {
    id: "sunset-cesme-fener",
    emoji: "🔆",
    category: "sunset",
    title: "Çeşme · Aya Yorgi feneri",
    body: "Alaçatı'dan 15dk. Kayalıklarda dj setleri yaz akşamları.",
    aiPrompt:
      "Aya Yorgi feneri / Çeşme batı sahili gün batımı için tavsiyeler? Nasıl gidilir, yakında ne içilir?",
  },
  {
    id: "sunset-karaburun",
    emoji: "🏞️",
    category: "sunset",
    title: "Karaburun yolu",
    body: "Mordoğan'dan Sazak koyuna virajlı sahil. Yol şarkıları için bahane.",
    aiPrompt:
      "Karaburun yarımadasında gün batımı için en iyi 3 koy, yol süresi ve mola önerisi.",
  },
  // EVENING
  {
    id: "evening-alsancak",
    emoji: "🍷",
    category: "evening",
    title: "Alsancak meze rotası",
    body: "Kıbrıs Şehitleri'nde balık & meze, ardından küçük bir bar.",
    aiPrompt:
      "Alsancak'ta meze + balık + sonrası bar rotası planla. 3-4 durak, fiyat aralığı ile.",
  },
  {
    id: "evening-bornova",
    emoji: "🎶",
    category: "evening",
    title: "Bornova kafe sokağı",
    body: "Üniversite enerjisi, canlı müzik, gece yarısı simit kokusu.",
    aiPrompt:
      "Bornova'da canlı müzik ve uygun fiyatlı kafe rotası öner. 4-5 mekan.",
  },
  {
    id: "evening-sirince",
    emoji: "🍇",
    category: "evening",
    title: "Şirince taverna gecesi",
    body: "Selçuk'tan 8dk yukarı. Meyve şarabı + ev yemekleri.",
    aiPrompt:
      "Şirince'de geceyi geçirmek için en iyi taverna ve butik konaklama önerileri.",
  },
  // WEEKEND
  {
    id: "weekend-alacati",
    emoji: "🏖️",
    category: "weekend",
    title: "Hafta sonu · Alaçatı",
    body: "Beyaz taş sokakları, sörf rüzgârı, brunch ve gece.",
    aiPrompt:
      "Çeşme-Alaçatı 2 gün hafta sonu için saatlik plan. Konaklama + 2 plaj + 3 restoran.",
  },
  {
    id: "weekend-sigacik",
    emoji: "⛵",
    category: "weekend",
    title: "Hafta sonu · Sığacık",
    body: "Antik Teos, kale içi sokaklar, balıkçı tezgâhları.",
    aiPrompt:
      "Sığacık-Doğanbey hafta sonu rotası. Antik Teos turu, balık halı ve kale içi öneriler.",
  },
  {
    id: "weekend-foca",
    emoji: "🐠",
    category: "weekend",
    title: "Hafta sonu · Foça",
    body: "Eski Foça meyhaneleri, Siren Kayalıkları, Yenifoça koyları.",
    aiPrompt:
      "Foça hafta sonu rotası. Konaklama, balık restoranları, tekne turu.",
  },
  // ÇEŞME
  {
    id: "cesme-surf",
    emoji: "🏄",
    category: "cesme",
    title: "Çeşme · Alaçatı rüzgârı",
    body: "Windsurf merkezleri, başlangıç dersi 1 saatten az.",
    aiPrompt:
      "Alaçatı'da windsurf nasıl öğrenilir? Okullar, fiyatlar, en iyi aylar.",
  },
  {
    id: "cesme-dj",
    emoji: "🎧",
    category: "cesme",
    title: "Çeşme · Sunset DJ set",
    body: "Aya Yorgi & Alaçatı plajları. Yaz aylarında haftalık.",
    aiPrompt:
      "Çeşme'de yaz akşamı sunset müzik mekanları ve günleri?",
  },
  // URLA
  {
    id: "urla-bag",
    emoji: "🍇",
    category: "urla",
    title: "Urla · Bağ yolu",
    body: "8 şarap üreticisi sıralı. Tadım randevulu, paket parke.",
    aiPrompt:
      "Urla bağ yolu nasıl gezilir? Hangi şaraplıklar randevu alır, ulaşım?",
  },
  {
    id: "urla-iskele",
    emoji: "🐟",
    category: "urla",
    title: "Urla · İskele balıkçıları",
    body: "Marina'da küçük tekneler, taze çupra, akşam piyasa.",
    aiPrompt:
      "Urla İskele'de en taze balığı nereden alırsın, hangi lokantada pişirtirsin?",
  },
  // QUOTES
  {
    id: "quote-attila",
    emoji: "🌊",
    category: "quote",
    title: "Attilâ İlhan",
    body: "\"İzmir gibisi yok, çünkü deniz şehir oluyor.\"",
    aiPrompt:
      "Attilâ İlhan'ın İzmir şiirlerinden 3 dize ve anlamını anlat.",
  },
  {
    id: "quote-sureya",
    emoji: "✍️",
    category: "quote",
    title: "Cemal Süreya",
    body: "\"Şehir senin gibi olmalı: hep bekleyen, hiç beklemeyen.\"",
    aiPrompt:
      "Cemal Süreya ve Ege ilişkisi üzerine kısa bir paragraf.",
  },
  {
    id: "quote-yasar",
    emoji: "📜",
    category: "quote",
    title: "Yaşar Kemal",
    body: "\"Anadolu'nun batıdaki sözü Egedir.\"",
    aiPrompt:
      "Yaşar Kemal'in Ege ile ilişkisi üzerine kısa bir hatırlatma.",
  },
  {
    id: "quote-loveizmir",
    emoji: "❤️",
    category: "quote",
    title: "Loveİzmir şarkısı",
    body: "Bu şehre bir kez âşık olursan, geri dönmek için her sebep var.",
    aiPrompt:
      "İzmir'i anlatan 5 Türkçe şarkıyı öner ve neden seçildiklerini söyle.",
  },
  // AI prompt
  {
    id: "ai-pick",
    emoji: "❤️",
    category: "ai",
    title: "Master AI önerisi",
    body: "Saatine, mevsimine ve havana göre kişisel öneri al.",
    aiPrompt:
      "Şu anki saat ve hava durumuna göre bugün İzmir'de yapabileceğim 3 spesifik şeyi öner. Yer, ulaşım, fiyat ile.",
  },
];

function hashDate(d: Date): number {
  const s = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getDailyCardsForBias(
  date: Date,
  bias: LoopCard["category"][],
  count = 5,
): LoopCard[] {
  const seed = hashDate(date);
  const all: LoopCard["category"][] = [
    "gastro",
    "sunset",
    "evening",
    "weekend",
    "cesme",
    "urla",
    "quote",
    "ai",
  ];
  // Ordered list: biased categories first (preserving given order), then the rest rotated by seed
  const remaining = all.filter((c) => !bias.includes(c));
  const startOffset = seed % Math.max(remaining.length, 1);
  const ordered: LoopCard["category"][] = [
    ...bias,
    ...remaining.map((_, i) => remaining[(startOffset + i) % remaining.length]!),
  ];

  const out: LoopCard[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < ordered.length && out.length < count; i++) {
    const cat = ordered[i]!;
    const inCat = POOL.filter((c) => c.category === cat);
    if (inCat.length === 0) continue;
    const idx = (seed + i) % inCat.length;
    const picked = inCat[idx];
    if (picked && !seen.has(picked.id)) {
      out.push(picked);
      seen.add(picked.id);
    }
  }
  return out;
}

export function getDailyCards(date: Date = new Date(), count = 5): LoopCard[] {
  const seed = hashDate(date);
  const allCategories: LoopCard["category"][] = [
    "gastro",
    "sunset",
    "evening",
    "weekend",
    "cesme",
    "urla",
    "quote",
    "ai",
  ];
  const total = allCategories.length;
  const startOffset = seed % total;
  const out: LoopCard[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < total && out.length < count; i++) {
    const cat = allCategories[(startOffset + i) % total]!;
    const inCat = POOL.filter((c) => c.category === cat);
    if (inCat.length === 0) continue;
    const idx = (seed + i) % inCat.length;
    const picked = inCat[idx];
    if (picked && !seen.has(picked.id)) {
      out.push(picked);
      seen.add(picked.id);
    }
  }
  return out;
}
