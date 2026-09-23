import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

import { AuthBadge } from "@/components/AuthBadge";
import { DailyLoop } from "@/components/DailyLoop";
import { DistrictPulse } from "@/components/DistrictPulse";
import { FomoTicker } from "@/components/FomoTicker";
import { HeartLogo } from "@/components/HeartLogo";
import { IntelligenceModes } from "@/components/IntelligenceModes";
import { LoveScoreBadge } from "@/components/LoveScoreBadge";
import { MoodHero } from "@/components/MoodHero";
import { SponsoredPlacement } from "@/components/SponsoredPlacement";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useBlog } from "@/contexts/BlogContext";
import { useNews } from "@/contexts/NewsContext";
import { useColors } from "@/hooks/useColors";

const QUICK = [
  {
    key: "arrival",
    title: "Varış",
    en: "Arrival",
    icon: "navigation" as const,
    route: "/guide" as const,
  },
  {
    key: "tours",
    title: "Turlar",
    en: "Tours",
    icon: "map" as const,
    route: "/guide" as const,
  },
  {
    key: "boat",
    title: "Tekne",
    en: "Boat",
    icon: "anchor" as const,
    route: "/life" as const,
    seg: "boat" as const,
  },
  {
    key: "car",
    title: "Araç",
    en: "Car",
    icon: "truck" as const,
    route: "/life" as const,
    seg: "car" as const,
  },
  {
    key: "stay",
    title: "Konaklama",
    en: "Stay",
    icon: "home" as const,
    route: "/life" as const,
    seg: "stay" as const,
  },
];

const HIGHLIGHTS = [
  {
    key: "kordon",
    title: "Kordon",
    subtitle: "Şehrin nabzı",
    image: require("../../assets/images/izmir-kordon.png"),
  },
  {
    key: "konak",
    title: "Konak & Saat Kulesi",
    subtitle: "İzmir'in kalbi",
    image: require("../../assets/images/konak.png"),
  },
  {
    key: "asansor",
    title: "Tarihi Asansör",
    subtitle: "Manzara nokta-i seyri",
    image: require("../../assets/images/asansor.png"),
  },
  {
    key: "cesme",
    title: "Alaçatı",
    subtitle: "Beyaz taş & mavi",
    image: require("../../assets/images/cesme-alacati.png"),
  },
  {
    key: "urla",
    title: "Urla Marina",
    subtitle: "Bağ & deniz",
    image: require("../../assets/images/urla-marina.png"),
  },
  {
    key: "ephesus",
    title: "Efes",
    subtitle: "UNESCO mirası",
    image: require("../../assets/images/ephesus.png"),
  },
];

function BlogTeaser() {
  const colors = useColors();
  const router = useRouter();
  const { posts, loading } = useBlog();
  const today = posts[0];

  return (
    <Pressable
      onPress={() => router.push("/blog")}
      style={[
        styles.blogTeaser,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Bugünün İzmir yazısı"
    >
      <View style={[styles.blogIcon, { backgroundColor: colors.aegeanDeep }]}>
        <Feather name="book-open" size={18} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.blogKicker, { color: colors.accent }]}>
          BUGÜNÜN YAZISI · GÜNCE
        </Text>
        <Text
          style={[styles.blogTitle, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {today
            ? today.title
            : loading
              ? "Bugünün İzmir yazısı hazırlanıyor…"
              : "İzmir tarihi, kültürü ve gelişimi — her sabah yeni"}
        </Text>
        {!!today?.subtitle && (
          <Text
            style={[styles.blogSub, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {today.subtitle}
          </Text>
        )}
      </View>
      <Feather name="arrow-right" size={18} color={colors.accent} />
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    items,
    loading: newsLoading,
    error: newsError,
    available: newsAvailable,
  } = useNews();

  const topNews = useMemo(() => items.slice(0, 3), [items]);

  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 110 : (insets.bottom || 0) + 90;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: topInset + 12,
          paddingBottom: bottomInset,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.kicker, { color: colors.mutedForeground }]}>
              Hoş geldin · Welcome
            </Text>
            <View style={styles.brandRow}>
              <Text style={[styles.brand, { color: colors.aegeanDeep }]}>
                Love
              </Text>
              <HeartLogo size={28} />
              <Text style={[styles.brand, { color: colors.aegeanDeep }]}>
                İzmir
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <LoveScoreBadge />
            <AuthBadge />
          </View>
        </View>

        <MoodHero />

        <FomoTicker />

        <DailyLoop />

        <DistrictPulse />

        <View style={styles.quickGrid}>
          {QUICK.map((q) => (
            <Pressable
              key={q.key}
              onPress={() =>
                "seg" in q && q.seg
                  ? router.push({ pathname: q.route, params: { seg: q.seg } })
                  : router.push(q.route)
              }
              style={[
                styles.quickItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${q.title} bölümünü aç`}
            >
              <View
                style={[
                  styles.quickIcon,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Feather name={q.icon} size={20} color={colors.accent} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>
                {q.title}
              </Text>
              <Text style={[styles.quickEn, { color: colors.mutedForeground }]}>
                {q.en}
              </Text>
            </Pressable>
          ))}
        </View>

        <SponsoredPlacement placementKey="A2" />

        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Öne çıkanlar
          </Text>
          <Text
            style={[styles.sectionTitleEn, { color: colors.mutedForeground }]}
          >
            Highlights
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
          decelerationRate="fast"
          snapToInterval={228}
        >
          {HIGHLIGHTS.map((h) => (
            <Pressable
              key={h.key}
              style={[styles.bigCard, { backgroundColor: colors.card }]}
              onPress={() => router.push("/guide")}
              accessibilityRole="button"
              accessibilityLabel={`${h.title} için rehberi aç`}
            >
              <Image
                source={h.image}
                style={styles.bigCardImg}
                contentFit="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.bigCardOverlay}
              />
              <View style={styles.bigCardText}>
                <Text style={styles.bigCardTitle}>{h.title}</Text>
                <Text style={styles.bigCardSubtitle}>{h.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={[
            styles.servicesBanner,
            { backgroundColor: colors.aegeanDeep },
          ]}
          onPress={() => router.push("/life")}
          accessibilityRole="button"
          accessibilityLabel="Tekne, araç ve konaklama hizmetlerini aç"
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.servicesKicker}>Book & Rent</Text>
            <Text style={styles.servicesTitle}>Tekne · Araç · Günlük Ev</Text>
            <Text style={styles.servicesSub}>
              Sağlık · Emlak · Konaklama seçeneklerini keşfet
            </Text>
          </View>
          <View style={styles.servicesArrow}>
            <Feather name="arrow-right" size={20} color="#fff" />
          </View>
        </Pressable>

        <BlogTeaser />

        <View style={styles.sectionTitleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Şu an İzmir'de
            </Text>
            <Text
              style={[styles.sectionTitleEn, { color: colors.mutedForeground }]}
            >
              Doğrulanmış şehir gündemi
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/news")}
            accessibilityRole="button"
            accessibilityLabel="Tüm İzmir haberlerini aç"
          >
            <Text style={[styles.linkText, { color: colors.accent }]}>
              Tümü
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {topNews.length === 0 ? (
            <View
              style={[
                styles.emptyBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="radio" size={20} color={colors.mutedForeground} />
              <Text
                style={{
                  color: colors.mutedForeground,
                  fontFamily: "Inter_500Medium",
                }}
              >
                {newsLoading
                  ? "Haberler yükleniyor…"
                  : newsError
                    ? newsError
                    : newsAvailable
                      ? "Henüz yayımlanmış haber yok."
                      : "Doğrulanmış haber kaynağı bağlı değil."}
              </Text>
            </View>
          ) : (
            topNews.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => router.push("/news")}
                style={[
                  styles.newsRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${n.title} haberini haberler ekranında aç`}
              >
                <View style={styles.newsTopRow}>
                  <View
                    style={[
                      styles.newsBadge,
                      { backgroundColor: colors.secondary },
                    ]}
                  >
                    <Text
                      style={[styles.newsBadgeText, { color: colors.accent }]}
                    >
                      {n.category}
                    </Text>
                  </View>
                  {n.publishedAt ? (
                    <Text
                      style={[
                        styles.newsTime,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {n.publishedAt}
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={[styles.newsTitle, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {n.title}
                </Text>
                <Text
                  style={[
                    styles.newsSummary,
                    { color: colors.mutedForeground },
                  ]}
                  numberOfLines={2}
                >
                  {n.summary}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  kicker: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  brand: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    letterSpacing: -0.5,
  },

  hero: {
    height: 220,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroContent: { padding: 20, gap: 6 },
  heroKicker: {
    color: "#fff",
    opacity: 0.9,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    lineHeight: 32,
  },
  heroCta: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  heroCtaText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginTop: 20,
    gap: 8,
  },
  quickItem: {
    width: "31%",
    marginHorizontal: "1.16%",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  quickEn: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    letterSpacing: -0.3,
  },
  sectionTitleEn: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingBottom: 3,
  },
  linkText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  cardRow: { paddingHorizontal: 20, gap: 12 },
  bigCard: {
    width: 216,
    height: 280,
    borderRadius: 22,
    overflow: "hidden",
  },
  bigCardImg: { width: "100%", height: "100%" },
  bigCardOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65%",
  },
  bigCardText: { position: "absolute", left: 16, right: 16, bottom: 16 },
  bigCardTitle: { color: "#fff", fontFamily: "Poppins_700Bold", fontSize: 19 },
  bigCardSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    marginTop: 3,
  },

  servicesBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  servicesKicker: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  servicesTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  servicesSub: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  servicesArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  newsRow: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  newsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newsBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newsBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newsTime: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  newsTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 15 },
  newsSummary: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  blogTeaser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  blogIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  blogKicker: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.3,
  },
  blogTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 2,
  },
  blogSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
});
