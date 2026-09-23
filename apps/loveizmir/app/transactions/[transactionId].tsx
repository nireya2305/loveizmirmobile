import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

import { useColors } from "@/hooks/useColors";
import { useGetMyTransaction, getGetMyTransactionQueryKey } from "@workspace/api-client-react";
import { 
  translateRequestStatus, 
  translatePaymentStatus, 
  translateFulfillmentStatus, 
  translateRequestType 
} from "@/lib/formatters";

export default function TransactionDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

  const { data, isLoading, isError, refetch } = useGetMyTransaction(transactionId as string, {
    query: {
      enabled: !!transactionId,
      queryKey: getGetMyTransactionQueryKey(transactionId as string),
    },
  });

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 24 : (insets.bottom || 0) + 16;

  const detail = data?.data;
  const transaction = detail?.transaction;
  const timeline = detail?.timeline || [];

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
            İşlem Detayı
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            ID: {transactionId}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !transaction ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            İşlem detayı yüklenemedi. Lütfen tekrar deneyin.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[styles.retryBtn, { backgroundColor: colors.coral }]}
          >
            <Text style={styles.retryBtnText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: bottomInset,
            paddingTop: 16,
            gap: 20,
          }}
        >
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Tarih</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>
                {new Date(transaction.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>İşlem Tipi</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>
                {translateRequestType(transaction.requestType)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Talep Durumu</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>
                {translateRequestStatus(transaction.requestStatus)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Karar Durumu</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>
                {translateRequestStatus(transaction.partnerDecision)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Ödeme Durumu</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>
                {translatePaymentStatus(transaction.paymentStatus)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Hizmet Durumu</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>
                {translateFulfillmentStatus(transaction.fulfillmentStatus)}
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Talep Mesajı</Text>
            <Text style={[styles.messageText, { color: colors.foreground }]}>
              {transaction.message}
            </Text>
          </View>

          {timeline.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>İşlem Geçmişi</Text>
              <View style={{ gap: 12, marginTop: 8 }}>
                {timeline.map((event) => (
                  <View key={event.id} style={{ gap: 4 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={[styles.label, { color: colors.foreground }]}>{event.eventType}</Text>
                      <Text style={[styles.value, { color: colors.mutedForeground, fontSize: 12 }]}>
                        {new Date(event.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
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
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingBottom: 8,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  value: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  messageText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
});
