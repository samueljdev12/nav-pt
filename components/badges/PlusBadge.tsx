import React from "react";
import { Text, StyleSheet, ViewStyle, Pressable } from "react-native";

export interface PlusBadgeProps {
  onPress?: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export function PlusBadge({
  onPress,
  color = "#22C55E",
  textColor = "#FFFFFF",
  style,
}: PlusBadgeProps) {
  const bg = `#${color.replace(/^#/, "")}`;
  const fg = `#${textColor.replace(/^#/, "")}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.circle,
        { backgroundColor: bg, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Add stop"
    >
      <Text style={[styles.plus, { color: fg }]}>+</Text>
    </Pressable>
  );
}

const SIZE = 30;

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  plus: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    includeFontPadding: false,
  },
});

export default PlusBadge;
