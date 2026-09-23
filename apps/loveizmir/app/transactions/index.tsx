import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useListMyTransactions, getListMyTransactionsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { translateRequestStatus, translateRequestType } from "@/lib/formatters";

export default function TransactionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, login, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading, isError, refetch } = useListMyTransactions({
    query: {
      enabled: isAuthenticated,
      queryKey: getListMyTransactionsQueryKey(),
    }
  });

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 24 : (insets.bottom || 0) + 16;

  const transactions = data?.data?.items || [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
        >
          <Feather name="arrow-left" size={18} color={colors.accent} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            İşlemlerim
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Tüm hizmet, satın alma ve rezervasyon talepleriniz
          </Text>
        </View>
      </View>

      {isAuthLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : !isAuthenticated ? (
        <View style={styles.center}>
          <Feather name="lock" size={48} color={colors.border} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            İşlemlerinizi görmek için giriş yapmalısınız.
          </Text>
          <Pressable
            onPress={() => login()}
            style={[styles.retryBtn, { backgroundColor: colors.coral, marginTop: 16 }]}
          >
            <Text style={styles.retryBtnText}>Giriş Yap</Text>
          </Pressable>
        </View>
      ) : isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            İşlemler yüklenemedi. Lütfen tekrar deneyin.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[styles.retryBtn, { backgroundColor: colors.coral }]}
          >
            <Text style={styles.retryBtnText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.center}>
          <Feather name="inbox" size={48} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Henüz bir işleminiz bulunmuyor.
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: bottomInset,
            paddingTop: 16,
            gap: 12,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/transactions/${item.id}`)}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: colors.accent }]}>
                    {translateRequestType(item.requestType)}
                  </Text>
                </View>
                <Text style={[styles.date, { color: colors.mutedForeground }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                Durum: {translateRequestStatus(item.requestStatus)}
              </Text>
              {item.message ? (
                <Text
                  style={[styles.cardMessage, { color: colors.mutedForeground }]}
                  numberOfLines={2}
                >
                  {item.message}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: "Poppins_700Bold", fontSize: 22 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  cardMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
