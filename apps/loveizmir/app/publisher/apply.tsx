import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useAuth } from "@/lib/auth";
import { useColors } from "@/hooks/useColors";
import { useCreateNewsPublisherApplication } from "@workspace/api-client-react";

export default function PublisherApplyScreen() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const createMutation = useCreateNewsPublisherApplication();

  const [form, setForm] = useState({
    legalName: "",
    publicationName: "",
    representativeName: "",
    officialEmail: "",
    officialWebsite: "https://",
    rightsDeclaration: "",
  });

  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingHorizontal: 40 }]}>
        <Feather name="shield" size={48} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
        <Text style={[styles.title, { color: colors.foreground, textAlign: "center" }]}>Yayıncı Başvurusu</Text>
        <Text style={[styles.desc, { color: colors.mutedForeground, textAlign: "center", marginBottom: 24 }]}>
          Başvuru yapabilmek için lütfen giriş yapın.
        </Text>
        <Pressable onPress={() => void login()} style={[styles.primaryBtn, { backgroundColor: colors.accent }]}>
          <Text style={styles.btnText}>Giriş Yap</Text>
        </Pressable>
      </View>
    );
  }

  const handleApply = () => {
    setError(null);
    if (!form.legalName || !form.publicationName || !form.representativeName || !form.officialEmail) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (form.rightsDeclaration.length < 10) {
      setError("Telif hakları beyanı en az 10 karakter olmalıdır.");
      return;
    }

    const payload = {
      ...form,
      termsVersion: "1.0",
      termsAccepted: true as const,
      submit: true,
    };

    createMutation.mutate({ data: payload }, {
      onSuccess: () => {
        if (Platform.OS !== "web") {
          Alert.alert("Başarılı", "Başvurunuz alınmıştır. Yayıncı panelinden durumunu takip edebilirsiniz.");
        }
        router.replace("/publisher/panel");
      },
      onError: (err: any) => {
        setError(err.message || "Başvuru sırasında bir hata oluştu.");
      }
    });
  };

  const isSubmitting = createMutation.isPending;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={20} color={colors.foreground} />
      </Pressable>

      <Text style={[styles.header, { color: colors.foreground }]}>Yayıncı Başvurusu</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        İzmir Haber ağına resmi yayıncı olarak katılmak için bilgilerinizi girin.
      </Text>

      {error && (
        <View style={[styles.errorBox, { backgroundColor: colors.destructive + "20" }]}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Yasal Ünvan *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={form.legalName}
          onChangeText={(val) => setForm(prev => ({ ...prev, legalName: val }))}
          placeholder="Şirket veya Şahıs Ünvanı"
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Yayın Adı *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={form.publicationName}
          onChangeText={(val) => setForm(prev => ({ ...prev, publicationName: val }))}
          placeholder="İzmir Haber Gazetesi"
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Temsilci Adı Soyadı *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={form.representativeName}
          onChangeText={(val) => setForm(prev => ({ ...prev, representativeName: val }))}
          placeholder="Ad Soyad"
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Resmi E-posta *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={form.officialEmail}
          onChangeText={(val) => setForm(prev => ({ ...prev, officialEmail: val }))}
          placeholder="iletisim@gazete.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Resmi Web Sitesi *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={form.officialWebsite}
          onChangeText={(val) => setForm(prev => ({ ...prev, officialWebsite: val }))}
          placeholder="https://..."
          keyboardType="url"
          autoCapitalize="none"
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Telif Hakları Beyanı *</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={form.rightsDeclaration}
          onChangeText={(val) => setForm(prev => ({ ...prev, rightsDeclaration: val }))}
          placeholder="İçeriklerin telif haklarına sahip olduğumuzu ve Loveİzmir platformunda listelenmesine izin verdiğimizi beyan ederiz."
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      <Pressable
        onPress={handleApply}
        disabled={isSubmitting}
        style={[
          styles.submitBtn,
          { backgroundColor: isSubmitting ? colors.muted : colors.accent, marginTop: 24 }
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Başvuruyu Gönder</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: { marginBottom: 16, width: 40, height: 40, justifyContent: "center" },
  header: { fontFamily: "Poppins_700Bold", fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 24 },
  title: { fontFamily: "Poppins_600SemiBold", fontSize: 22, marginBottom: 8 },
  desc: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  primaryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  btnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15, textAlign: "center" },
  formGroup: { marginBottom: 16 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13, marginBottom: 8, marginLeft: 4 },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  submitBtn: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  errorBox: { padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { fontFamily: "Inter_500Medium", fontSize: 13 },
});
