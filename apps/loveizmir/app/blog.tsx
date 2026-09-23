import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartLogo } from "@/components/HeartLogo";
import { useBlog } from "@/contexts/BlogContext";
import { useColors } from "@/hooks/useColors";

function formatDate(iso: string): string {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, loading, error, refresh } = useBlog();

  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;
  const today = posts[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: topInset + 8,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Geri"
            style={[
              styles.backBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.kicker, { color: colors.accent }]}>
              GÜNCE · DAILY BLOG
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              İzmir Günlüğü
            </Text>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>
              Her sabah Loveİzmir için taze bir İzmir yazısı hazırlanır.
            </Text>
          </View>
          <Pressable
            onPress={() => void refresh()}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Yenile"
            style={[
              styles.backBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Feather name="refresh-cw" size={16} color={colors.accent} />
            )}
          </Pressable>
        </View>

        {today && (
          <Pressable
            onPress={() =>
              router.push({ pathname: "/blog/[id]", params: { id: today.id } })
            }
            style={[styles.heroCard, { backgroundColor: colors.aegeanDeep }]}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.45)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroBody}>
              <View style={styles.heartBubble}>
                <HeartLogo size={18} />
              </View>
              <Text style={styles.heroDate}>
                BUGÜN · {formatDate(today.date).toUpperCase()}
              </Text>
              <Text style={styles.heroTitle}>{today.title}</Text>
              {!!today.subtitle && (
                <Text style={styles.heroSubtitle}>{today.subtitle}</Text>
              )}
              <Text style={styles.heroExcerpt} numberOfLines={3}>
                {today.excerpt}
              </Text>
              <View style={styles.heroCta}>
                <Text style={styles.heroCtaText}>Yazıyı oku</Text>
                <Feather name="arrow-right" size={16} color="#fff" />
              </View>
            </View>
          </Pressable>
        )}

        {loading && posts.length === 0 && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.accent} />
            <Text
              style={[styles.loadingText, { color: colors.mutedForeground }]}
            >
              Bugünün yazısı hazırlanıyor…
            </Text>
          </View>
        )}

        {error && posts.length === 0 && (
          <View
            style={[
              styles.errorWrap,
              { backgroundColor: colors.secondary, borderColor: colors.border },
            ]}
          >
            <Feather name="alert-circle" size={18} color={colors.accent} />
            <Text style={[styles.errorText, { color: colors.foreground }]}>
              {error}. Yenile butonuna basarak tekrar deneyin.
            </Text>
          </View>
        )}

        {posts.length > 1 && (
          <>
            <Text style={[styles.archiveTitle, { color: colors.foreground }]}>
              Arşiv
            </Text>
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              {posts.slice(1).map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() =>
                    router.push({
                      pathname: "/blog/[id]",
                      params: { id: p.id },
                    })
                  }
                  style={[
                    styles.archiveCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.archiveDate, { color: colors.accent }]}>
                    {formatDate(p.date)}
                  </Text>
                  <Text
                    style={[
                      styles.archiveTitleText,
                      { color: colors.foreground },
                    ]}
                  >
                    {p.title}
                  </Text>
                  {!!p.subtitle && (
                    <Text
                      style={[
                        styles.archiveSub,
                        { color: colors.mutedForeground },
                      ]}
                      numberOfLines={2}
                    >
                      {p.subtitle}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  kicker: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: { fontFamily: "Poppins_700Bold", fontSize: 24, marginTop: 2 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },

  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 220,
    justifyContent: "flex-end",
  },
  heroBody: { padding: 22, gap: 6 },
  heartBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heroDate: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    lineHeight: 30,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    marginTop: 2,
  },
  heroExcerpt: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  heroCtaText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },

  loadingWrap: { alignItems: "center", gap: 10, paddingVertical: 30 },
  loadingText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  errorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  errorText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 13 },

  archiveTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  archiveCard: { padding: 14, borderRadius: 16, borderWidth: 1, gap: 4 },
  archiveDate: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  archiveTitleText: { fontFamily: "Poppins_600SemiBold", fontSize: 15 },
  archiveSub: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 17 },
});
