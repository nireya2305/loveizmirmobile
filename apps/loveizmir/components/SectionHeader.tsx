import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  title: string;
  subtitle?: string;
  kicker?: string;
};

export function SectionHeader({ title, subtitle, kicker }: Props) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      {kicker ? (
        <Text style={[styles.kicker, { color: colors.accent }]}>{kicker}</Text>
      ) : null}
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, marginTop: 24, marginBottom: 12, gap: 2 },
  kicker: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  sub: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4 },
});
