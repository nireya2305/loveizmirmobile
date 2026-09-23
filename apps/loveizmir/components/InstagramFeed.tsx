import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  type InstagramPost,
} from "@/lib/instagram";

type Props = {
  posts: InstagramPost[];
  connected: boolean;
};

export function InstagramFeed({ posts, connected }: Props) {
  const colors = useColors();

  const open = useCallback(async (url: string) => {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          window.open(url, "_blank", "noopener,noreferrer");
        }
        return;
      }
      await WebBrowser.openBrowserAsync(url);
    } catch {
      try {
        await Linking.openURL(url);
      } catch {
        /* noop */
      }
    }
  }, []);

  const followCta = (
    <Pressable
      onPress={() => open(INSTAGRAM_PROFILE_URL)}
      style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`@${INSTAGRAM_HANDLE} Instagram'da takip et`}
    >
      <LinearGradient
        colors={["#f58529", "#dd2a7b", "#8134af"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ctaInner}
      >
        <Feather name="instagram" size={18} color="#fff" />
        <Text style={styles.ctaText}>@{INSTAGRAM_HANDLE} · Takip Et</Text>
      </LinearGradient>
    </Pressable>
  );

  if (!connected || posts.length === 0) {
    const title = connected ? "Henüz gönderi yok" : "Canlı feed çok yakında";
    const body = connected
      ? `@${INSTAGRAM_HANDLE} hesabında paylaşım yapıldığında gönderiler burada görünecek. Bizi Instagram'da takip edebilirsin.`
      : `@${INSTAGRAM_HANDLE} hesabı bağlandığında en güncel gönderiler burada otomatik olarak akacak. Şimdilik bizi Instagram'da takip edebilirsin.`;
    return (
      <View style={styles.wrap}>
        <View
          style={[
            styles.empty,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={["#f58529", "#dd2a7b", "#8134af"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyIcon}
          >
            <Feather name="instagram" size={26} color="#fff" />
          </LinearGradient>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            {body}
          </Text>
          {followCta}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {posts.map((post) => {
          const src = post.thumbnailUrl ?? post.mediaUrl;
          return (
            <Pressable
              key={post.id}
              onPress={() => open(post.permalink)}
              style={({ pressed }) => [
                styles.cell,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              accessibilityRole="imagebutton"
              accessibilityLabel={post.caption ?? "Instagram gönderisi"}
            >
              <Image
                source={{ uri: src }}
                style={styles.cellImage}
                contentFit="cover"
                transition={200}
              />
              {post.mediaType === "VIDEO" ? (
                <View style={styles.badge}>
                  <Feather name="play" size={12} color="#fff" />
                </View>
              ) : post.mediaType === "CAROUSEL_ALBUM" ? (
                <View style={styles.badge}>
                  <Feather name="copy" size={12} color="#fff" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>{followCta}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 6,
  },
  cell: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  cellImage: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  emptyBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  cta: { width: "100%", borderRadius: 14, overflow: "hidden", marginTop: 4 },
  ctaInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
