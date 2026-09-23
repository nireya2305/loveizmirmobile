import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLoveScore } from "@/contexts/LoveScoreContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useColors } from "@/hooks/useColors";
import { useIzmirPulse } from "@/hooks/useIzmirPulse";
import { DISTRICTS, type District } from "@/lib/izmirKnowledge";
import { weatherEmoji, weatherLabel } from "@/lib/weather";

const SCORE_ROWS: {
  key: keyof District["scores"];
  label: string;
  emoji: string;
}[] = [
  { key: "gastro", label: "Gastronomi", emoji: "🍽️" },
  { key: "romance", label: "Romantik", emoji: "💛" },
  { key: "luxury", label: "Lüks", emoji: "✨" },
  { key: "calm", label: "Sakin", emoji: "🌿" },
  { key: "nightlife", label: "Gece hayatı", emoji: "🌃" },
  { key: "investment", label: "Yatırım", emoji: "📈" },
];

type Quick = {
  label: string;
  emoji: string;
  modeKey?: string;
  prompt: (d: District) => string;
};

const QUICK_PROMPTS: Quick[] = [
  {
    label: "Bugün burada ne yapayım",
    emoji: "🗺️",
    prompt: (d) =>
      `${d.name}'da bugün için saat saat tam günlük bir plan kur. Hava ve günün saatine göre güncel öneri.`,
  },
  {
    label: "En iyi gastronomi",
    emoji: "🍷",
    modeKey: "gastro",
    prompt: (d) =>
      `${d.name} bölgesinde gastronomi haritası: kahvaltı, öğle, akşam ve gece için en iyi 5 yer. Signature lezzetler ve rezervasyon zorluğu ile.`,
  },
  {
    label: "Romantik plan",
    emoji: "🌅",
    prompt: (d) =>
      `${d.name}'da çift için romantik bir akşamüstü+gece planı: sunset noktası, yemek, bar ve gece yürüyüşü.`,
  },
  {
    label: "Nerede kalayım",
    emoji: "🏨",
    modeKey: "hotel",
    prompt: (d) =>
      `${d.name} ve civarında 3 farklı stilde konaklama: lüks, butik, bütçe dostu. Sunset/plaj/marina yakınlığı ile.`,
  },
  {
    label: "Gizli yerler",
    emoji: "🔑",
    modeKey: "kemeralti",
    prompt: (d) =>
      `${d.name}'da turistlerin gitmediği, sadece yerellerin bildiği 5 yer öner. Hikaye ve nasıl gidileceği ile.`,
  },
  {
    label: "Yatırım analizi",
    emoji: "🏗️",
    modeKey: "realestate",
    prompt: (d) =>
      `${d.name} için emlak ve yatırım analizi: prestij, deniz mesafesi, kira/satış eğilimi, kimlere uygun.`,
  },
];

function formatSunset(date: Date | null): string | null {
  if (!date) return null;
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return null;
  }
}

export default function DistrictScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { award } = useLoveScore();
  const { trackDistrict, trackMode } = usePreferences();
  const { weather, sunsetDate, msToSunset, mood } = useIzmirPulse();
  const params = useLocalSearchParams<{ key?: string | string[] }>();
  const districtKey = Array.isArray(params.key) ? params.key[0] : params.key;

  const district = useMemo<District | undefined>(
    () => DISTRICTS.find((d) => d.key === districtKey),
    [districtKey],
  );

  if (!district) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>
          İlçe bulunamadı.
        </Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: colors.accent }}>← Geri</Text>
        </Pressable>
      </View>
    );
  }

  const onAsk = (q: Quick) => {
    // legacy disabled, use FAB
  };

  const onDefaultAsk = () => {
    // legacy disabled, use FAB
  };

  const others = DISTRICTS.filter((d) => d.key !== district.key).slice(0, 6);

  const sunsetText = formatSunset(sunsetDate);
  const sunsetCountdown =
    msToSunset !== null && msToSunset > 0 && msToSunset < 6 * 60 * 60 * 1000
      ? `${Math.floor(msToSunset / 60000)} dk`
      : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: insets.bottom + 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <LinearGradient
            colors={district.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroBody, { paddingTop: insets.top + 12 }]}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="chevron-left" size={20} color="#fff" />
              <Text style={styles.backBtnText}>Geri</Text>
            </Pressable>

            <View style={styles.heroMeta}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>İZMİR · LIVE</Text>
              </View>
              <Text style={styles.heroName}>{district.name}</Text>
              <Text style={styles.heroTag}>{district.tagline}</Text>

              <View style={styles.heroLiveRow}>
                {weather && (
                  <View style={styles.liveChip}>
                    <Text style={styles.liveChipText}>
                      {weatherEmoji(weather.weatherCode, weather.isDay)}{" "}
                      {Math.round(weather.temperatureC)}° ·{" "}
                      {weatherLabel(weather.weatherCode)}
                    </Text>
                  </View>
                )}
                {sunsetText && (
                  <View style={styles.liveChip}>
                    <Text style={styles.liveChipText}>
                      🌅 {sunsetText}
                      {sunsetCountdown ? ` · ${sunsetCountdown}` : ""}
                    </Text>
                  </View>
                )}
                <View style={styles.liveChip}>
                  <Text style={styles.liveChipText}>
                    {mood.emoji} {mood.oneLiner}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* SCORES */}
        <View style={styles.section}>
          <Text style={[styles.sectionKicker, { color: colors.accent }]}>
            BÖLGE PROFİLİ
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Kişilik skorları
          </Text>
          <View
            style={[
              styles.scoreBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {SCORE_ROWS.map((sr) => {
              const v = district.scores[sr.key];
              return (
                <View key={sr.key} style={styles.scoreRow}>
                  <Text style={styles.scoreEmoji}>{sr.emoji}</Text>
                  <Text
                    style={[styles.scoreLabel, { color: colors.foreground }]}
                  >
                    {sr.label}
                  </Text>
                  <View
                    style={[
                      styles.scoreTrack,
                      { backgroundColor: colors.secondary },
                    ]}
                  >
                    <View
                      style={[
                        styles.scoreFill,
                        {
                          width: `${v}%`,
                          backgroundColor: colors.aegeanDeep,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.scoreNum, { color: colors.foreground }]}>
                    {v}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* HIGHLIGHTS */}
        <View style={styles.section}>
          <Text style={[styles.sectionKicker, { color: colors.accent }]}>
            BURADA NE VAR
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Öne çıkanlar
          </Text>
          <View style={styles.tagRow}>
            {district.highlights.map((h) => (
              <View
                key={h}
                style={[
                  styles.bigTag,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.bigTagText, { color: colors.foreground }]}>
                  {h}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* OTHER DISTRICTS */}
        <View style={styles.section}>
          <Text style={[styles.sectionKicker, { color: colors.accent }]}>
            DAHA FAZLA
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Diğer ilçeler
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.othersRow}
          >
            {others.map((d) => (
              <Pressable
                key={d.key}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    void Haptics.selectionAsync();
                  }
                  router.replace({
                    pathname: "/district/[key]",
                    params: { key: d.key },
                  });
                }}
                style={styles.otherCard}
              >
                <LinearGradient
                  colors={d.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.otherCardBody}>
                  <Text style={styles.otherCardName}>{d.name}</Text>
                  <Text style={styles.otherCardTag} numberOfLines={1}>
                    {d.tagline}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  backLink: { padding: 12 },

  hero: { minHeight: 260, overflow: "hidden" },
  heroBody: { flex: 1, padding: 20, justifyContent: "space-between" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.28)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  backBtnText: { color: "#fff", fontFamily: "Inter_500Medium", fontSize: 12 },

  heroMeta: { gap: 6, marginTop: 32 },
  heroPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.32)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroPillText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.4,
  },
  heroName: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 38,
    marginTop: 6,
  },
  heroTag: {
    color: "rgba(255,255,255,0.94)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  heroLiveRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  liveChip: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveChipText: {
    color: "#fff",
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },

  section: { paddingHorizontal: 20, marginTop: 24, gap: 10 },
  sectionKicker: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.4,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginBottom: 6,
  },

  scoreBox: { padding: 14, borderRadius: 16, borderWidth: 1, gap: 10 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  scoreEmoji: { fontSize: 14, width: 20, textAlign: "center" },
  scoreLabel: {
    width: 90,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  scoreTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  scoreFill: { height: "100%", borderRadius: 3 },
  scoreNum: {
    width: 28,
    textAlign: "right",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  bigTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  bigTagText: { fontFamily: "Inter_500Medium", fontSize: 12 },

  heroCta: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    marginTop: 2,
  },
  heroCtaBody: { padding: 16, gap: 8 },
  heroCtaTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  heroCtaSub: {
    color: "rgba(255,255,255,0.92)",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
  heroCtaPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.32)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 4,
  },
  heroCtaPillText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  quickTile: {
    width: "48%",
    minHeight: 78,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  quickEmoji: { fontSize: 18 },
  quickLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },

  othersRow: { gap: 10, paddingRight: 20 },
  otherCard: {
    width: 140,
    height: 96,
    borderRadius: 14,
    overflow: "hidden",
  },
  otherCardBody: { flex: 1, padding: 12, justifyContent: "flex-end" },
  otherCardName: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
  otherCardTag: {
    color: "rgba(255,255,255,0.92)",
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    marginTop: 2,
  },
});
