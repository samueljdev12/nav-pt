import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { hexToRgba } from "@/utils/colorUtils";
import {
  RouteIcon,
  CardTitle,
  CardSubtitle,
  MinutesPill,
} from "@/components/ui/card-primitives";

export interface StopCardProps {
  title: string;
  subtitle: string;
  minutes?: number;
  color?: string; // hex with or without '#'
  textColor?: string; // hex with or without '#'
  mode?: string; // BUS | TRAIN | TRAM | ...
  style?: ViewStyle;
}

/**
 * Carousel StopCard
 * - Uses shared primitives from ui/card-primitives so typography and
 *   pill styling match the modal card exactly.
 * - Keeps the minutes pill on the right side (optional).
 */
export function StopCard({
  title,
  subtitle,
  minutes,
  color = "F59E0B",
  textColor = "FFFFFF",
  mode = "BUS",
  style,
}: StopCardProps) {
  const normalize = (c?: string) => (c ? String(c).replace(/^#/, "") : "");
  const routeColor = normalize(color) || "F59E0B";
  const routeTextColor = normalize(textColor) || "FFFFFF";

  // subtle card background using the route color at low opacity
  const cardBg = hexToRgba(routeColor, 0.12);

  return (
    <View style={[styles.card, { backgroundColor: cardBg }, style]}>
      <View style={styles.leftRow}>
        <RouteIcon
          mode={mode}
          bgColor={routeColor}
          tintColor={routeTextColor}
        />

        <View style={styles.texts}>
          <CardTitle>{title}</CardTitle>
          <CardSubtitle bgColor={routeColor} textColor={routeTextColor}>
            {subtitle}
          </CardSubtitle>
        </View>
      </View>

      <MinutesPill
        minutes={minutes}
        bgColor={routeColor}
        textColor={routeTextColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  texts: {
    flex: 1,
    justifyContent: "center",
  },
});
