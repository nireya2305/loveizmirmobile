import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";

import { useColors } from "@/hooks/useColors";
import {
  useCreateTransactionRequest,
  getListMyTransactionsQueryKey,
  type TransactionRequestType,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

export default function RequestTransactionScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { isAuthenticated, login, isLoading: isAuthLoading } = useAuth();
  const params = useLocalSearchParams<{
    placeId: string;
    businessId: string;
  }>();

  const placeId = params.placeId as string;
  // Note: businessId is fetched from route context per requirements.
  const businessId = params.businessId as string;

  const [message, setMessage] = useState("");
  const [requestType, setRequestType] =
    useState<TransactionRequestType>("SERVICE_REQUEST");

  const idempotencyKey = useMemo(() => Crypto.randomUUID(), []);

  const createRequest = useCreateTransactionRequest({
    request: {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    },
  });

  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 24 : (insets.bottom || 0) + 16;

  const handleSubmit = () => {
    if (!placeId) return;
    if (!message.trim()) return;
    if (!isAuthenticated) {
      login();
      return;
    }

    const payload = {
      placeId,
      requestType,
      message: message.trim(),
    };

    createRequest.mutate(
      { data: payload, headers: { "Idempotency-Key": Date.now().toString() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListMyTransactionsQueryKey(),
          });
        },
      },
    );
  };

  if (!placeId) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>
          Bilinmeyen yer (placeId eksik).
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.coral }}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  if (createRequest.isSuccess) {
    return (
      <View
        style={[styles.center, { backgroundColor: colors.background, gap: 20 }]}
      >
        <View
          style={[
            styles.successIconBox,
            { backgroundColor: colors.aegean + "22" },
          ]}
        >
          <Feather name="check-circle" size={48} color={colors.aegean} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Talebiniz Alındı
        </Text>
        <Text style={[styles.successText, { color: colors.mutedForeground }]}>
          Talebiniz başarıyla iletildi. Durumunu "İşlemlerim" sekmesinden takip
          edebilirsiniz.
        </Text>
        <Pressable
          onPress={() => router.replace("/transactions")}
          style={[styles.primaryBtn, { backgroundColor: colors.aegean }]}
        >
          <Text style={styles.primaryBtnText}>İşlemlerime Git</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          disabled={createRequest.isPending}
        >
          <Feather name="arrow-left" size={18} color={colors.accent} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Talep Oluştur
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Yer: {placeId.slice(0, 8)}...
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: bottomInset + 40,
          paddingTop: 16,
          gap: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Talep Tipi
          </Text>
          <View style={styles.typeRow}>
            {(
              [
                "SERVICE_REQUEST",
                "BOOKING_REQUEST",
                "PURCHASE_REQUEST",
              ] as const
            ).map((type) => (
              <Pressable
                key={type}
                onPress={() => setRequestType(type)}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor:
                      requestType === type ? colors.coral : colors.card,
                    borderColor:
                      requestType === type ? colors.coral : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    {
                      color: requestType === type ? "#fff" : colors.foreground,
                    },
                  ]}
                >
                  {type === "SERVICE_REQUEST"
                    ? "Hizmet"
                    : type === "BOOKING_REQUEST"
                      ? "Rezervasyon"
                      : "Satın Alma"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Mesajınız
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Talebinizle ilgili detayları buraya yazın..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        {createRequest.isError && (
          <View
            style={[
              styles.errorBox,
              {
                backgroundColor: colors.coral + "11",
                borderColor: colors.coral,
              },
            ]}
          >
            <Feather name="alert-circle" size={16} color={colors.coral} />
            <Text style={[styles.errorBoxText, { color: colors.coral }]}>
              Talep oluşturulamadı. Lütfen tekrar deneyin.
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={
            createRequest.isPending ||
            (!isAuthenticated ? false : !message.trim())
          }
          style={[
            styles.primaryBtn,
            {
              backgroundColor:
                !isAuthenticated || (message.trim() && !createRequest.isPending)
                  ? colors.coral
                  : colors.muted,
              marginTop: 10,
            },
          ]}
        >
          {createRequest.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : !isAuthenticated ? (
            <Text style={styles.primaryBtnText}>
              Devam Etmek İçin Giriş Yap
            </Text>
          ) : (
            <Text style={styles.primaryBtnText}>Talebi Gönder</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  section: {
    gap: 8,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  typeChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 120,
    textAlignVertical: "top",
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primaryBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorBoxText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    flex: 1,
  },
});
