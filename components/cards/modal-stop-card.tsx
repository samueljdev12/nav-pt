import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { hexToRgba } from "@/utils/colorUtils";
import {
  RouteIcon,
  CardTitle,
  CardSubtitle,
} from "@/components/ui/card-primitives";

export interface ModalStopCardProps {
  title: string;
  subtitle: string;
  color?: string; // hex string, with or without '#'
  textColor?: string; // hex string, with or without '#'
  mode?: string; // BUS | TRAIN | TRAM | ...
  style?: ViewStyle;
}

/**
 * ModalStopCard
 *
 * Refactored to use shared UI primitives so typography, spacing and
 * pill styles match exactly between carousel and modal variants.
 *
 * - Uses `RouteIcon` for the circular icon
 * - Uses `CardTitle` for title typography
 * - Uses `CardSubtitle` for the colored subtitle pill
 *
 * The component only differs from the carousel card by omitting the minutes pill.
 */
export function ModalStopCard({
  title,
  subtitle,
  color = "F59E0B",
  textColor = "FFFFFF",
  mode = "BUS",
  style,
}: ModalStopCardProps) {
  // normalize color (remove leading '#') so primitives accept either format
  const normalize = (c?: string) =>
    c ? String(c).replace(/^#/, "") : undefined;
  const routeColor = normalize(color) || "F59E0B";
  const routeTextColor = normalize(textColor) || "FFFFFF";

  // subtle card background using route color at low opacity
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
