const SLOGANS = [
  "Loveİzmir — İzmir’i yaşa.",
  "Loveİzmir — Ege’nin dijital kalbi.",
  "Loveİzmir — Şehir seninle konuşuyor.",
  "Loveİzmir — İzmir’i keşfet, hisset, yaşa.",
  "Loveİzmir — The AI soul of İzmir.",
] as const;

export const LOVEIZMIR_BRAND = {
  name: "Loveİzmir",
  masterAiId: "cmpc4e2bs008do801m8ced3bd",
  slogans: SLOGANS,
  canonicalSlogan: SLOGANS[0],
  copy: {
    tr: {
      mission:
        "Loveİzmir, İzmir’i yaşayan, hisseden, keşfettiren ve kullanıcıya kişisel şehir deneyimi sunan AI destekli premium şehir yaşam platformudur.",
      positioning:
        "Loveİzmir bir gezi rehberi değil; İzmir’in AI destekli duygusal işletim sistemidir.",
      personality:
        "Loveİzmir sıcak, zarif, yerel kültürü bilen, modern ve duygusal bir şehir markasıdır.",
      emotional: "Bugün İzmir’de bir şey kaçırmamalıyım.",
      livingCity:
        "İzmir’in yaşayan dijital ruhu; kültür, lezzet ve sosyal hayat seninle birlikte akıyor.",
    },
    en: {
      mission:
        "Loveİzmir is an AI-powered premium city-life platform that brings İzmir to life, helps people feel and discover it, and offers a personal city experience.",
      positioning:
        "Loveİzmir is not a travel guide. Loveİzmir is the AI-powered emotional operating system of İzmir.",
      personality:
        "Loveİzmir is a warm, elegant, modern and emotional city brand that knows local culture.",
      emotional: "I should not miss what İzmir has to offer today.",
      livingCity:
        "İzmir’s living digital spirit, where culture, flavor and social life flow with you.",
    },
  },
  socialChannels: [
    {
      id: "instagram",
      label: "Instagram",
      handle: "lovei_zmir",
      profileUrl: "https://www.instagram.com/lovei_zmir/",
      official: true,
      configured: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      handle: null,
      profileUrl: null,
      official: false,
      configured: false,
    },
    {
      id: "tiktok",
      label: "TikTok",
      handle: null,
      profileUrl: null,
      official: false,
      configured: false,
    },
    {
      id: "youtube",
      label: "YouTube",
      handle: null,
      profileUrl: null,
      official: false,
      configured: false,
    },
    {
      id: "threads",
      label: "Threads",
      handle: null,
      profileUrl: null,
      official: false,
      configured: false,
    },
  ],
} as const;

export const LOVEIZMIR_DESIGN_TOKENS = {
  color: {
    light: {
      background: "#fdfaf5",
      foreground: "#1a2332",
      card: "#ffffff",
      cardForeground: "#1a2332",
      primary: "#0891b2",
      primaryForeground: "#ffffff",
      secondary: "#fef3e7",
      secondaryForeground: "#1a2332",
      muted: "#f5ede0",
      mutedForeground: "#6b7280",
      accent: "#ff6b6b",
      accentForeground: "#ffffff",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      border: "#ece3d3",
      input: "#ece3d3",
      aegean: "#0891b2",
      aegeanDeep: "#0e7490",
      sunset: "#ff8c61",
      coral: "#ff6b6b",
      sand: "#fef3e7",
      olive: "#7a8450",
      gold: "#c78b2c",
    },
    dark: {
      background: "#0a1626",
      foreground: "#e9eef5",
      card: "#10223a",
      cardForeground: "#e9eef5",
      primary: "#22d3ee",
      primaryForeground: "#04222c",
      secondary: "#13273f",
      secondaryForeground: "#e9eef5",
      muted: "#15273e",
      mutedForeground: "#9fb2c8",
      accent: "#ff7a7a",
      accentForeground: "#1a0d0d",
      destructive: "#f87171",
      destructiveForeground: "#1a0d0d",
      border: "#1d3552",
      input: "#1d3552",
      aegean: "#22d3ee",
      aegeanDeep: "#0e7490",
      sunset: "#ff9b75",
      coral: "#ff7a7a",
      sand: "#13273f",
      olive: "#9aa86a",
      gold: "#e4b45d",
    },
  },
  typography: {
    body: "Inter",
    display: "Poppins",
    webDisplayFallback: "Plus Jakarta Sans",
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    pill: 999,
  },
  motion: {
    fastMs: 160,
    normalMs: 240,
    slowMs: 480,
  },
  accessibility: {
    minimumTouchTarget: 44,
  },
} as const;

export type LoveIzmirBrand = typeof LOVEIZMIR_BRAND;
export type LoveIzmirDesignTokens = typeof LOVEIZMIR_DESIGN_TOKENS;
export type LoveIzmirLocale = keyof LoveIzmirBrand["copy"];
export type LoveIzmirBrandCopy = LoveIzmirBrand["copy"][LoveIzmirLocale];
export type LoveIzmirSocialChannel =
  (typeof LOVEIZMIR_BRAND.socialChannels)[number];

export function getLoveIzmirBrandCopy(
  locale: LoveIzmirLocale = "tr",
): LoveIzmirBrandCopy {
  return LOVEIZMIR_BRAND.copy[locale];
}
