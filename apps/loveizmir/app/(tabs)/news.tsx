import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { useColors } from "@/hooks/useColors";
import {
  useListNews,
  useListBreakingNews,
  useListNewsCategories,
  useListNewsDistricts,
} from "@workspace/api-client-react";
import { HeartLogo } from "@/components/HeartLogo";

function formatTime(ts: string | null | undefined): string {
  if (!ts) return "henüz";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  return new Date(ts).toLocaleDateString("tr-TR");
}

export default function NewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [filterCategory, setFilterCategory] = useState<string | undefined>();
  const [filterDistrict, setFilterDistrict] = useState<string | undefined>();

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
    refetch: refetchNews,
    isRefetching,
  } = useListNews({
    category: filterCategory,
    district: filterDistrict,
    limit: 20,
  });

  const { data: breakingData, isLoading: breakingLoading } = useListBreakingNews();
  const { data: categoriesData } = useListNewsCategories();
  const { data: districtsData } = useListNewsDistricts();

  const items = (newsData as any)?.data?.items ?? (newsData as any)?.items ?? [];
  const sponsored = (newsData as any)?.data?.sponsored ?? (newsData as any)?.sponsored ?? [];
  const breakingItems = (breakingData as any)?.data?.items ?? (breakingData as any)?.items ?? [];
  const categories = (categoriesData as any)?.data?.items ?? (categoriesData as any)?.items ?? [];
  const districts = (districtsData as any)?.data?.items ?? (districtsData as any)?.items ?? [];

  const isLoading = newsLoading;
  const isAvailable = true; // Assuming API is reachable

  const onRefresh = useCallback(() => {
    void refetchNews();
  }, [refetchNews]);

  const openUrl = useCallback(async (url?: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      // ignore
    }
  }, []);

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 110 : (insets.bottom || 0) + 90;

  const renderItem = ({ item, isSponsored }: { item: any; isSponsored?: boolean }) => (
    <Pressable
      onPress={() => openUrl(item.sourceUrl)}
      style={[
        styles.card,
        { backgroundColor: isSponsored ? colors.secondary + "20" : colors.card, borderColor: isSponsored ? colors.secondary : colors.border },
      ]}
      accessibilityRole="link"
      accessibilityLabel={`${item.title} haberini aç`}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.accent }]}>
              {item.category || "Haber"}
            </Text>
          </View>
          {item.district ? (
            <View style={[styles.badge, { backgroundColor: colors.muted, marginLeft: 8 }]}>
              <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
                {item.district}
              </Text>
            </View>
          ) : null}
          {item.verificationStatus === "VERIFIED" ? (
             <Feather name="check-circle" size={14} color={colors.accent} style={{ marginLeft: 8 }} />
          ) : null}
        </View>
        <HeartLogo size={14} />
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>
        {item.title}
      </Text>
      <Text style={[styles.summary, { color: colors.mutedForeground }]}>
        {item.excerpt}
      </Text>

      <View style={styles.metaFooter}>
        <View style={styles.sourceRow}>
          <Feather name="globe" size={11} color={colors.aegean} />
          <Text style={[styles.sourceText, { color: colors.aegean }]}>
            {item.publisherName || item.sourceName || "Bilinmeyen Kaynak"}
          </Text>
        </View>
        <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
          {formatTime(item.publishedAt)}
        </Text>

        <View style={styles.readRow}>
          <Text style={[styles.readText, { color: colors.accent }]}>Habere git</Text>
          <Feather name="external-link" size={12} color={colors.accent} />
        </View>
      </View>
      {isSponsored && (
        <View style={[styles.sponsoredBadge, { backgroundColor: colors.background }]}>
          <Text style={[styles.sponsoredText, { color: colors.mutedForeground }]}>Sponsorlu</Text>
        </View>
      )}
    </Pressable>
  );

  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.centered}>
        <Feather name="inbox" size={48} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
        <Text style={[styles.errorTitle, { color: colors.foreground }]}>
          İzmir Haber henüz aktif değil
        </Text>
        <Text style={[styles.errorMsg, { color: colors.mutedForeground }]}>
          İzmir'in doğrulanmış haber kaynakları ağı şu an oluşturuluyor. Platformumuza katılarak bu ağın bir parçası olabilirsiniz.
        </Text>

        <View style={styles.emptyActions}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/publisher")}
          >
            <Feather name="award" size={16} color="#fff" />
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>Yayıncı başvurusu</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtnOutline, { borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Feather name="plus-circle" size={16} color={colors.foreground} />
            <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Haber kaynağı öner</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtnOutline, { borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Feather name="grid" size={16} color={colors.foreground} />
            <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Kategorileri keşfet</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const listData = useMemo(() => {
    const combined = [...items];
    if (sponsored.length > 0) {
      combined.splice(2, 0, { ...sponsored[0], isSponsored: true });
    }
    return combined;
  }, [items, sponsored]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View>
          <Text style={[styles.heading, { color: colors.aegeanDeep }]}>
            İzmir'de Son Dakika
          </Text>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.pulseDot,
                { backgroundColor: isLoading || isRefetching ? colors.accent : colors.aegean },
              ]}
            />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {isLoading || isRefetching
                ? "Haber kaynağı güncelleniyor…"
                : isAvailable
                  ? `Kaynak · Güncellendi ${formatTime(new Date().toISOString())}`
                  : "Doğrulanmış kaynak bağlı değil"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/publisher")}
          style={[styles.refreshBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
        >
          <Feather name="award" size={20} color={colors.accent} />
        </Pressable>
      </View>

      <View style={{ marginBottom: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <Pressable
            onPress={() => setFilterCategory(undefined)}
            style={[
              styles.filterChip,
              { backgroundColor: !filterCategory ? colors.foreground : colors.card, borderColor: !filterCategory ? colors.foreground : colors.border }
            ]}
          >
            <Text style={[styles.filterText, { color: !filterCategory ? colors.background : colors.foreground }]}>Tümü</Text>
          </Pressable>
          {categories.map((cat: any) => (
            <Pressable
              key={cat.slug}
              onPress={() => setFilterCategory(cat.slug === filterCategory ? undefined : cat.slug)}
              style={[
                styles.filterChip,
                { backgroundColor: filterCategory === cat.slug ? colors.foreground : colors.card, borderColor: filterCategory === cat.slug ? colors.foreground : colors.border }
              ]}
            >
              <Text style={[styles.filterText, { color: filterCategory === cat.slug ? colors.background : colors.foreground }]}>
                {cat.nameTr || cat.name || cat.slug}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem({ item, isSponsored: item.isSponsored })}
        contentContainerStyle={{
          paddingBottom: bottomInset,
          gap: 16,
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  heading: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    letterSpacing: -0.5,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  metaText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  refreshBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  card: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 10 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: { fontFamily: "Poppins_600SemiBold", fontSize: 17, lineHeight: 24 },
  summary: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 },

  metaFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
    flexWrap: "wrap",
  },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sourceText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  timeText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  readRow: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  sponsoredBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.1)",
  },
  sponsoredText: { fontFamily: "Inter_500Medium", fontSize: 10, textTransform: "uppercase" },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 40,
  },
  errorTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 20, marginBottom: 8, textAlign: "center" },
  errorMsg: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyActions: { width: "100%", gap: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12 },
  actionBtnOutline: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
});
