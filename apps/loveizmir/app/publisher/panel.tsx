import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useAuth } from "@/lib/auth";
import { useColors } from "@/hooks/useColors";
import { useGetNewsPublisherPanel } from "@workspace/api-client-react";

export default function PublisherPanelScreen() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, isLoading, error } = useGetNewsPublisherPanel({
    query: {
      enabled: isAuthenticated,
      queryKey: ["/api/v1/news/publisher-panel"],
      retry: false,
    },
  });

  const panelData = data as any; // Cast from Envelope

  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingHorizontal: 40 }]}>
        <Feather name="lock" size={48} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
        <Text style={[styles.title, { color: colors.foreground, textAlign: "center" }]}>Yayıncı Paneli</Text>
        <Text style={[styles.desc, { color: colors.mutedForeground, textAlign: "center", marginBottom: 24 }]}>
          Yayıncı paneline erişmek için giriş yapmalısınız.
        </Text>
        <Pressable
          onPress={() => void login()}
          style={[styles.btn, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.btnText}>Giriş Yap</Text>
        </Pressable>
      </View>
    );
  }

  const isApplied = panelData?.application || panelData?.publisher;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}
    >
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={20} color={colors.foreground} />
      </Pressable>

      <Text style={[styles.header, { color: colors.foreground }]}>Yayıncı Paneli</Text>

      {!isApplied ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="file-text" size={32} color={colors.accent} style={{ marginBottom: 12 }} />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Başvurunuz Bulunmuyor</Text>
          <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
            İzmir Haber ekosistemine katılmak ve içeriklerinizi İzmirlilerle buluşturmak için yayıncı başvurusu yapabilirsiniz.
          </Text>
          <Pressable
            onPress={() => router.push("/publisher/apply")}
            style={[styles.primaryBtn, { backgroundColor: colors.accent, marginTop: 16 }]}
          >
            <Text style={styles.btnText}>Başvuru Yap</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Başvuru Durumu</Text>
            <Text style={[styles.cardDesc, { color: colors.mutedForeground, marginTop: 8 }]}>
              {panelData?.application?.status === "APPROVED" || panelData?.publisher
                ? "Başvurunuz onaylandı ve yayıncılığınız aktif."
                : "Başvurunuz inceleme aşamasında."}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Feed & İçerik Entegrasyonu</Text>
            <Text style={[styles.cardDesc, { color: colors.mutedForeground, marginTop: 8 }]}>
              RSS veya JSON feed adresiniz sistemlerimize kaydedilmiştir. Ancak otomatik senkronizasyon şu anda askıya alınmıştır, lütfen temsilcinizle görüşün.
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.destructive + "20", alignSelf: "flex-start", marginTop: 12 }]}>
              <Text style={[styles.badgeText, { color: colors.destructive }]}>Harici Çalıştırma Devre Dışı</Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Teklif Al & Paketler</Text>
            <Text style={[styles.cardDesc, { color: colors.mutedForeground, marginTop: 8 }]}>
              Görünürlüğünüzü artırmak için premium paket tekliflerimiz mevcuttur. Ödeme entegrasyonu web yönetim panelinden yapılmaktadır.
            </Text>
            <Pressable
              style={[styles.secondaryBtn, { backgroundColor: colors.muted, marginTop: 16 }]}
              onPress={() => {}}
            >
              <Text style={[styles.btnText, { color: colors.foreground }]}>Web'den Teklif Alın</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: { marginBottom: 16, width: 40, height: 40, justifyContent: "center" },
  header: { fontFamily: "Poppins_700Bold", fontSize: 28, marginBottom: 24, letterSpacing: -0.5 },
  title: { fontFamily: "Poppins_600SemiBold", fontSize: 22, marginBottom: 8 },
  desc: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  btnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15, textAlign: "center" },
  card: { padding: 20, borderRadius: 16, borderWidth: 1 },
  cardTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 18 },
  cardDesc: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 },
  primaryBtn: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  secondaryBtn: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, textTransform: "uppercase" },
});
