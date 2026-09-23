import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InstagramFeed } from "@/components/InstagramFeed";
import { Skeleton } from "@/components/Skeleton";
import { useColors } from "@/hooks/useColors";
import { OFFICIAL_SOCIAL_CHANNELS } from "@/lib/brand";
import {
  getInstagramPosts,
  INSTAGRAM_HANDLE,
  type InstagramPost,
} from "@/lib/instagram";

export default function InstagramScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await getInstagramPosts();
        if (!active) return;
        setPosts(result.posts);
        setConnected(result.connected);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

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
              SOSYAL · @{INSTAGRAM_HANDLE}
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Instagram
            </Text>
          </View>
        </View>

        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          İzmir'in günlük ruhu — gün batımları, gastronomi, etkinlikler ve
          sokak anları. Loveİzmir'in resmi Instagram akışı.
        </Text>

        <View style={styles.channelRow}>
          {OFFICIAL_SOCIAL_CHANNELS.map((channel) => (
            <View
              key={channel.id}
              style={[
                styles.channel,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              accessibilityRole="text"
              accessibilityLabel={`${channel.label}: ${
                channel.state === "official"
                  ? `resmi hesap @${channel.handle}; canlı akış bağlı değil`
                  : "yapılandırılmadı"
              }`}
            >
              <Text style={[styles.channelName, { color: colors.foreground }]}>
                {channel.label}
              </Text>
              <Text
                style={[
                  styles.channelState,
                  {
                    color:
                      channel.state === "official"
                        ? colors.accent
                        : colors.mutedForeground,
                  },
                ]}
              >
                {channel.state === "official"
                  ? `Resmi · @${channel.handle}`
                  : "Yapılandırılmadı"}
              </Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.skeletonGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} width="32%" height={110} radius={10} />
            ))}
          </View>
        ) : (
          <InstagramFeed posts={posts} connected={connected} />
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
    marginBottom: 8,
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
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    letterSpacing: -0.5,
  },
  intro: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  channelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  channel: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  channelName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  channelState: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    marginTop: 2,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 6,
  },
});
