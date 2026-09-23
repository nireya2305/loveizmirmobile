import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useColors } from "@/hooks/useColors";

export function ThemeToggle() {
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={() => void toggleTheme()}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      accessibilityState={{ selected: isDark }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.secondary,
          borderColor: colors.border,
          opacity: pressed ? 0.65 : 1,
        },
      ]}
    >
      <Feather
        name={isDark ? "sun" : "moon"}
        size={19}
        color={colors.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
