import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthBadge } from "@/components/AuthBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useColors } from "@/hooks/useColors";

type Props = {
  title: string;
  titleEn?: string;
  subtitle?: string;
};

export function ScreenHeader({ title, titleEn, subtitle }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={[styles.wrap, { paddingTop: topInset + 12 }]}>
      <View style={styles.row}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.aegeanDeep }]}>
            {title}
          </Text>
          {titleEn ? (
            <Text style={[styles.en, { color: colors.mutedForeground }]}>
              {titleEn}
            </Text>
          ) : null}
        </View>
        <Pressable
          onPress={() => router.push("/profile")}
          style={[styles.profileBtn, { backgroundColor: colors.secondary }]}
          accessibilityRole="button"
          accessibilityLabel={t("common.profile")}
        >
          <Feather name="user" size={16} color={colors.accent} />
        </Pressable>
        <AuthBadge />
      </View>
      {subtitle ? (
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 6 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    letterSpacing: -0.5,
  },
  en: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  sub: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 6 },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
