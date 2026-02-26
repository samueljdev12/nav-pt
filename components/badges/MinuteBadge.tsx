import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, ViewStyle } from "react-native";

export interface MinuteBadgeProps {
  minutes: number;
  color?: string;
  textColor?: string;
  pulse?: boolean;
  style?: ViewStyle;
}

// ─── Urgency colour palette ────────────────────────────────────────────────
function urgencyColor(minutes: number): string {
  if (minutes <= 1) return "#EF4444";
  if (minutes <= 4) return "#F97316";
  if (minutes <= 9) return "#EAB308";
  return "#22C55E";
}

function normalizeHex(raw?: string): string | undefined {
  if (!raw) return undefined;
  return `#${raw.replace(/^#/, "")}`;
}

export function MinuteBadge({
  minutes,
  color,
  textColor,
  pulse = true,
  style,
}: MinuteBadgeProps) {
  const resolvedColor = normalizeHex(color) ?? urgencyColor(minutes);
  const resolvedText = normalizeHex(textColor) ?? "#FFFFFF";
  const isImminent = minutes <= 1;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pulse && isImminent) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [pulse, isImminent, pulseAnim]);

  const label = minutes <= 0 ? "Due" : `${minutes} min`;

  return (
    <Animated.View
      style={[
        styles.pill,
        { backgroundColor: resolvedColor },
        isImminent && pulse ? { opacity: pulseAnim } : undefined,
        style,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Arriving in ${label}`}
    >
      <Text style={[styles.text, { color: resolvedText }]}>{label}</Text>
    </Animated.View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

export default MinuteBadge;
