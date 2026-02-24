import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { hexToRgba } from "@/utils/colorUtils";
import { getModeIcon } from "@/utils/iconUtils";

export interface StopCardProps {
  title: string;
  subtitle: string;
  minutes: number;
  color?: string;
  textColor?: string;
  mode?: string;
}

export function StopCard({
  title,
  subtitle,
  minutes,
  color = "F59E0B",
  textColor = "FFFFFF",
  mode = "BUS",
}: StopCardProps) {
  const cardBgColor = hexToRgba(color, 0.55);
  const subtitleBgColor = `#${color}`;
  const subtitleTextColor = `#${textColor}`;
  const modeIcon = getModeIcon(mode);

  return (
    <View style={[styles.card, { backgroundColor: cardBgColor }]}>
      <View style={styles.leftRow}>
        <View style={[styles.iconCircle, { backgroundColor: subtitleBgColor }]}>
          <Image source={modeIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text
            style={[
              styles.subtitle,
              { backgroundColor: subtitleBgColor, color: subtitleTextColor },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.minutesBox}>
        <Text style={styles.minutesValue}>{minutes}</Text>
        <Text style={styles.minutesLabel}>min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F59E0B",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconCircle: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
  texts: {
    flex: 1,
  },
  title: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A1A",
    backgroundColor: "#dddddd",
    paddingVertical: 1,
    borderRadius: 10,
    marginBottom: 2,
    width: "100%",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    borderRadius: 18,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#FCD34D",
    paddingVertical: 3,
  },
  minutesBox: {
    alignItems: "center",
    marginLeft: 12,
  },
  minutesValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  minutesLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
