import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CuratedTrips } from "@/components/CuratedTrips";
import { HeartLogo } from "@/components/HeartLogo";
import { InteractiveMap } from "@/components/InteractiveMap";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { ART_SPOTS, DISTRICTS, MUST_DO, TOURS, TRANSPORT } from "@/lib/data";
import { useColors } from "@/hooks/useColors";

type TabKey =
  | "map"
  | "curated"
  | "arrival"
  | "tours"
  | "districts"
  | "mustdo"
  | "art";

const TABS: { key: TabKey; label: string; en: string }[] = [
  { key: "map", label: "Harita", en: "Map" },
  { key: "curated", label: "Geziler", en: "Curated" },
  { key: "arrival", label: "Varış", en: "Arrival" },
  { key: "tours", label: "Turlar", en: "Tours" },
  { key: "districts", label: "İlçeler", en: "Nearby" },
  { key: "mustdo", label: "Meşhur", en: "Must Do" },
  { key: "art", label: "Sanat", en: "Art" },
];

export default function GuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("map");

  const bottomInset = Platform.OS === "web" ? 120 : (insets.bottom || 0) + 100;

  const askAi = (question: string) => {
    // legacy disabled, use FAB
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Rehber"
        titleEn="Your İzmir Travel Guide"
        subtitle="Havaalanından otantik köylere — İzmir'i baştan sona keşfet."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityLabel={`${t.label}, ${t.en}`}
              accessibilityState={{ selected: active }}
              style={[
                styles.tabChip,
                {
                  backgroundColor: active ? colors.accent : colors.card,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? "#fff" : colors.foreground },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomInset }}
        showsVerticalScrollIndicator={false}
      >
        {tab === "map" && (
          <>
            <SectionHeader
              kicker="İzmir Map"
              title="İzmir'i haritada keşfet"
              subtitle="Pinlere dokun, mekan hakkında AI'ya sor."
            />
            <InteractiveMap height={520} />
          </>
        )}

        {tab === "curated" && (
          <>
            <SectionHeader
              kicker="Curated Trips"
              title="Küratöryel İzmir gezileri"
              subtitle="Gurme, sanat, spor ve tarih rotaları — saatlik akış ve ipuçlarıyla."
            />
            <CuratedTrips />
          </>
        )}

        {tab === "arrival" && (
          <>
            <Image
              source={require("../../assets/images/airport.png")}
              style={styles.bannerImg}
              contentFit="cover"
            />
            <SectionHeader
              kicker="Arrival & Transport"
              title="İzmir'e nasıl ulaşırsın?"
              subtitle="Havalimanı, tren, otobüs, vapur — tüm giriş noktaları."
            />
            <View style={styles.col}>
              {TRANSPORT.map((t) => (
                <View
                  key={t.key}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.cardHead}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Feather name={t.icon} size={20} color={colors.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.titleRow}>
                        <Text
                          style={[
                            styles.cardTitle,
                            { color: colors.foreground },
                          ]}
                        >
                          {t.title}
                        </Text>
                        {t.code ? (
                          <View
                            style={[
                              styles.codeBadge,
                              { backgroundColor: colors.aegean },
                            ]}
                          >
                            <Text style={styles.codeText}>{t.code}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.cardEn,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {t.titleEn}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.body, { color: colors.foreground }]}>
                    {t.description}
                  </Text>
                  <View style={styles.tipsBox}>
                    {t.tips.map((tip) => (
                      <View key={tip} style={styles.tipRow}>
                        <Feather
                          name="check-circle"
                          size={13}
                          color={colors.aegean}
                        />
                        <Text
                          style={[
                            styles.tipText,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {tip}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "tours" && (
          <>
            <SectionHeader
              kicker="Curated Tours"
              title="Tercih edilen turlar"
              subtitle="Yarım gün, tam gün ve çoklu durak rotaları."
            />
            <View style={styles.col}>
              {TOURS.map((t) => (
                <View
                  key={t.key}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.tourHeadRow}>
                    <Text
                      style={[
                        styles.cardTitle,
                        { color: colors.foreground, flex: 1 },
                      ]}
                    >
                      {t.title}
                    </Text>
                    <View
                      style={[
                        styles.durBadge,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Feather name="clock" size={11} color={colors.accent} />
                      <Text style={[styles.durText, { color: colors.accent }]}>
                        {t.duration}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.body, { color: colors.mutedForeground }]}
                  >
                    {t.description}
                  </Text>
                  <View style={styles.stopList}>
                    {t.stops.map((s, i) => (
                      <View key={s} style={styles.stopRow}>
                        <View
                          style={[
                            styles.stopDot,
                            { backgroundColor: colors.accent },
                          ]}
                        >
                          <Text style={styles.stopNum}>{i + 1}</Text>
                        </View>
                        <Text
                          style={[
                            styles.stopText,
                            { color: colors.foreground },
                          ]}
                        >
                          {s}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "districts" && (
          <>
            <SectionHeader
              kicker="Around İzmir"
              title="Yakındaki turistik ilçeler"
              subtitle="Bir günlük kaçamaktan haftalık tatile uzanan rotalar."
            />
            <View style={styles.col}>
              {DISTRICTS.map((d) => (
                <Pressable
                  key={d.key}
                  onPress={() =>
                    router.push({ pathname: "/district/[key]", params: { key: d.key } })
                  }
                  style={[
                    styles.placeCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Image
                    source={d.image}
                    style={styles.placeImg}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.55)"]}
                    style={styles.placeOverlay}
                  />
                  <View style={styles.placeDist}>
                    <Feather name="navigation" size={11} color="#fff" />
                    <Text style={styles.placeDistText}>{d.distance}</Text>
                  </View>
                  <View style={styles.placeBody}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.cardTitle,
                          { color: colors.foreground, flex: 1 },
                        ]}
                      >
                        {d.title}
                      </Text>
                      <HeartLogo size={16} />
                    </View>
                    <Text
                      style={[styles.cardEn, { color: colors.mutedForeground }]}
                    >
                      {d.titleEn}
                    </Text>
                    <Text
                      style={[
                        styles.body,
                        { color: colors.mutedForeground, marginTop: 8 },
                      ]}
                    >
                      {d.description}
                    </Text>
                    <View style={styles.tagsRow}>
                      {d.highlights.map((h) => (
                        <View
                          key={h}
                          style={[
                            styles.tag,
                            { backgroundColor: colors.secondary },
                          ]}
                        >
                          <Text
                            style={[styles.tagText, { color: colors.accent }]}
                          >
                            {h}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {tab === "mustdo" && (
          <>
            <SectionHeader
              kicker="Famous & Must Do"
              title="İzmir'in meşhurları"
              subtitle="Bir kez deneyince unutamayacağın şeyler."
            />
            <View style={[styles.col, { paddingHorizontal: 20 }]}>
              {MUST_DO.map((m) => (
                <View
                  key={m.key}
                  style={[
                    styles.mustRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={styles.emojiBig}>{m.emoji}</Text>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={[styles.cardTitle, { color: colors.foreground }]}
                    >
                      {m.title}
                    </Text>
                    <Text
                      style={[styles.body, { color: colors.mutedForeground }]}
                    >
                      {m.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "art" && (
          <>
            <Image
              source={require("../../assets/images/art.png")}
              style={styles.bannerImg}
              contentFit="cover"
            />
            <SectionHeader
              kicker="Art & Culture"
              title="Sanatsal yerler"
              subtitle="Müze, galeri, festival ve performans mekanları."
            />
            <View style={[styles.col, { paddingHorizontal: 20 }]}>
              {ART_SPOTS.map((a) => (
                <View
                  key={a.key}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: colors.secondary },
                    ]}
                  >
                    <Text style={[styles.typeText, { color: colors.accent }]}>
                      {a.type}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: colors.foreground, marginTop: 8 },
                    ]}
                  >
                    {a.title}
                  </Text>
                  <Text
                    style={[styles.body, { color: colors.mutedForeground }]}
                  >
                    {a.description}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tabChip: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
  },
  tabLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  bannerImg: {
    height: 160,
    marginHorizontal: 20,
    borderRadius: 18,
    marginTop: 4,
  },

  col: { paddingHorizontal: 20, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  cardHead: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  cardEn: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 2,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  body: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  tipsBox: { gap: 6, marginTop: 2 },
  tipRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tipText: { fontFamily: "Inter_500Medium", fontSize: 13, flex: 1 },

  aiCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  aiCtaText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    flex: 1,
  },

  tourHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  durBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  durText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stopList: { gap: 8, marginTop: 4 },
  stopRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stopDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stopNum: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },
  stopText: { fontFamily: "Inter_500Medium", fontSize: 13, flex: 1 },
  cardCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  cardCtaText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  placeCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  placeImg: { width: "100%", height: 170 },
  placeOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 170,
  },
  placeDist: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  placeDistText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  placeBody: { padding: 16, gap: 4 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.3,
  },

  mustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  emojiBig: { fontSize: 32 },

  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
