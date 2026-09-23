import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/lib/auth";

export function AuthBadge() {
  const colors = useColors();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Pressable
        onPress={() => void login()}
        accessibilityRole="button"
        accessibilityLabel="Giriş yap"
        style={[styles.btn, { backgroundColor: colors.aegeanDeep }]}
      >
        <Feather name="log-in" size={14} color="#fff" />
        <Text style={styles.btnTextLight}>Giriş yap</Text>
      </Pressable>
    );
  }

  const initial =
    (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();
  const label =
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "Kullanıcı";

  return (
    <Pressable
      onPress={() => void logout()}
      accessibilityRole="button"
      accessibilityLabel="Çıkış yap"
      style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={[styles.btnText, { color: colors.foreground }]} numberOfLines={1}>
        {label}
      </Text>
      <Feather name="log-out" size={13} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 180,
    minHeight: 34,
    ...(Platform.OS === "web" ? { borderWidth: 1 } : {}),
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },
  btnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    maxWidth: 110,
  },
  btnTextLight: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
});
