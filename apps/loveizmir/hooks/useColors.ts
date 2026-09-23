import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 *
 * `constants/colors.ts` ships both `light` and `dark` palettes (dark =
 * navy + ocean tokens per the MD-002 design system), so this hook switches
 * palettes automatically based on the device's appearance setting. If a
 * `dark` key were ever removed it safely falls back to `light`.
 */
export function useColors() {
  const { isDark } = useTheme();
  const palette = isDark ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
