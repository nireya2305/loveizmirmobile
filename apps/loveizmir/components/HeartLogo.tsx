import React from "react";
import { Platform } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

type Props = {
  size?: number;
  filled?: boolean;
  accessibilityLabel?: string;
};

export function HeartLogo({
  size = 28,
  filled = true,
  accessibilityLabel,
}: Props) {
  const decorative = !accessibilityLabel;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...(Platform.OS === "web"
        ? {
            "aria-hidden": decorative || undefined,
            "aria-label": accessibilityLabel,
            role: accessibilityLabel ? ("img" as const) : undefined,
          }
        : {
            accessible: !decorative,
            accessibilityLabel,
            accessibilityRole: decorative ? undefined : ("image" as const),
            accessibilityElementsHidden: decorative,
            importantForAccessibility: decorative
              ? ("no" as const)
              : ("yes" as const),
          })}
    >
      <Defs>
        <LinearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ff8c61" />
          <Stop offset="1" stopColor="#ff6b6b" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.5 3.4 5 7 5c2 0 3.5 1.1 5 2.8C13.5 6.1 15 5 17 5c3.6 0 5.8 3.5 4.5 6.8C19.5 16.4 12 21 12 21z"
        fill={filled ? "url(#heartGrad)" : "none"}
        stroke="#ff6b6b"
        strokeWidth={filled ? 0 : 1.6}
      />
    </Svg>
  );
}
