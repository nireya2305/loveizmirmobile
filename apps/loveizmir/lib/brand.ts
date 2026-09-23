import {
  getLoveIzmirBrandCopy,
  LOVEIZMIR_BRAND,
  type LoveIzmirLocale,
} from "@workspace/loveizmir-brand";

export { getLoveIzmirBrandCopy, LOVEIZMIR_BRAND };
export type { LoveIzmirLocale };

export const BRAND_SLOGANS = LOVEIZMIR_BRAND.slogans;
export const CANONICAL_SLOGAN = LOVEIZMIR_BRAND.canonicalSlogan;
export const BRAND_COPY = getLoveIzmirBrandCopy;
export const EMOTIONAL_RULE = getLoveIzmirBrandCopy("tr").emotional;
export const LIVING_CITY_COPY = getLoveIzmirBrandCopy("tr").livingCity;
export const MASTER_AI_ID = LOVEIZMIR_BRAND.masterAiId;

export type OfficialSocialChannel = {
  id: (typeof LOVEIZMIR_BRAND.socialChannels)[number]["id"];
  label: string;
  handle: string | null;
  profileUrl: string | null;
  state: "official" | "unconfigured";
};

export const OFFICIAL_SOCIAL_CHANNELS: readonly OfficialSocialChannel[] =
  LOVEIZMIR_BRAND.socialChannels.map((channel) => ({
    id: channel.id,
    label: channel.label,
    handle: channel.handle,
    profileUrl: channel.profileUrl,
    state: channel.official ? "official" : "unconfigured",
  }));

export const OFFICIAL_INSTAGRAM = OFFICIAL_SOCIAL_CHANNELS[0];
