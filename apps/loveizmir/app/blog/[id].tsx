import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
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

export default function BlogDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { posts } = useBlog();
  const post = posts.find((p) => p.id === params.id);

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  if (!post) {
    return (
      <View
        style={[
          { flex: 1, backgroundColor: colors.background, paddingTop: topInset },
          styles.notFoundWrap,
        ]}
      >
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>
          Yazı bulunamadı.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backLink, { backgroundColor: colors.accent }]}
        >
          <Feather name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backLinkText}>Geri dön</Text>
        </Pressable>
      </View>
    );
  }

  const paragraphs = post.content.split(/\n\n+/).filter((p) => p.trim());

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: topInset + 8,
          paddingBottom: insets.bottom + 60,
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
          <HeartLogo size={22} />
        </View>

        <View style={styles.body}>
          <Text style={[styles.date, { color: colors.accent }]}>
            {formatDate(post.date).toUpperCase()} · LOVE İZMİR GÜNCE
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {post.title}
          </Text>
          {!!post.subtitle && (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {post.subtitle}
            </Text>
          )}
          <View
            style={[
              styles.topicChip,
              { backgroundColor: colors.secondary, borderColor: colors.border },
            ]}
          >
            <Feather name="book-open" size={12} color={colors.accent} />
            <Text style={[styles.topicText, { color: colors.accent }]}>
              {post.topic}
            </Text>
          </View>

          {paragraphs.map((p, i) => (
            <Text
              key={i}
              style={[styles.paragraph, { color: colors.foreground }]}
            >
              {p}
            </Text>
          ))}

          {post.sources && post.sources.length > 0 && (
            <View style={styles.sourcesBlock}>
              <Text
                style={[styles.sourcesTitle, { color: colors.foreground }]}
              >
                Kaynaklar
              </Text>
              {post.sources.map((s, i) => (
                <Pressable
                  key={`${s.url}-${i}`}
                  onPress={() => WebBrowser.openBrowserAsync(s.url).catch(() => {})}
                  accessibilityRole="link"
                  style={[
                    styles.sourceRow,
                    { borderColor: colors.border },
                  ]}
                >
                  <Feather
                    name="external-link"
                    size={13}
                    color={colors.accent}
                  />
                  <Text
                    style={[styles.sourceText, { color: colors.aegeanDeep }]}
                  >
                    {s.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { paddingHorizontal: 22, paddingTop: 14, gap: 10 },
  date: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    lineHeight: 34,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  topicChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 6,
  },
  topicText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.4,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
  },

  sourcesBlock: { marginTop: 24, gap: 8 },
  sourcesTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  sourceText: { fontFamily: "Inter_600SemiBold", fontSize: 13, flex: 1 },

  notFoundWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: { fontFamily: "Poppins_600SemiBold", fontSize: 18 },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  backLinkText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },
});
