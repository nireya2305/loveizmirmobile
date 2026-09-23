import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useListNewsPublishers } from "@workspace/api-client-react";

export default function PublisherDirectoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, isLoading, error } = useListNewsPublishers();

  const items = ((data as any)?.data?.items ?? (data as any)?.items ?? []) as any[];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Yayıncı Dizini</Text>
      </View>

      <View style={styles.showcase}>
        <View style={[styles.heroCard, { backgroundColor: colors.aegeanDeep }]}>
          <Feather name="award" size={32} color={colors.accent} style={{ marginBottom: 12 }} />
          <Text style={styles.heroTitle}>Doğrulanmış Kaynaklar</Text>
          <Text style={styles.heroDesc}>
            İzmir Haber ekosistemindeki tüm haberler, resmi ve doğrulanmış yayıncılar tarafından sağlanmaktadır.
          </Text>
          <View style={styles.heroActions}>
            <Pressable
              style={[styles.heroBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push("/publisher/apply")}
            >
              <Text style={styles.heroBtnText}>Yayıncı Başvurusu</Text>
            </Pressable>
            <Pressable
              style={[styles.heroBtnOutline, { borderColor: "rgba(255,255,255,0.3)" }]}
              onPress={() => router.push("/publisher/panel")}
            >
              <Text style={[styles.heroBtnText, { color: "#fff" }]}>Yayıncı Paneli</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Aktif Yayıncılar</Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Yayıncılar yüklenemedi.</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.center}>
            <Feather name="inbox" size={32} color={colors.mutedForeground} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Henüz aktif bir yayıncı bulunmuyor.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {items.map((pub: any) => (
              <View key={pub.id} style={[styles.pubCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {pub.logoUrl ? (
                  <Image source={{ uri: pub.logoUrl }} style={styles.pubLogo} resizeMode="contain" />
                ) : (
                  <View style={[styles.pubLogoPlaceholder, { backgroundColor: colors.muted }]}>
                    <Feather name="image" size={16} color={colors.mutedForeground} />
                  </View>
                )}
                <View style={styles.pubInfo}>
                  <Text style={[styles.pubName, { color: colors.foreground }]} numberOfLines={1}>{pub.publicationName}</Text>
                  <Text style={[styles.pubCategory, { color: colors.mutedForeground }]} numberOfLines={1}>{pub.legalName}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                  <Feather name="check-circle" size={12} color={colors.accent} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  title: { fontFamily: "Poppins_700Bold", fontSize: 24, letterSpacing: -0.5 },

  showcase: { paddingHorizontal: 20, marginBottom: 32 },
  heroCard: { padding: 24, borderRadius: 20 },
  heroTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 20, color: "#fff", marginBottom: 8 },
  heroDesc: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 20, marginBottom: 20 },
  heroActions: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  heroBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  heroBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff" },
  heroBtnOutline: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },

  listSection: { paddingHorizontal: 20 },
  sectionTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 18, marginBottom: 16 },
  center: { padding: 40, alignItems: "center" },
  errorText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 14 },

  grid: { gap: 12 },
  pubCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  pubLogo: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#fff" },
  pubLogoPlaceholder: { width: 40, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  pubInfo: { flex: 1 },
  pubName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  pubCategory: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  badge: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
