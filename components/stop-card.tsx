import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface StopCardProps {
  title: string;
  subtitle: string;
  minutes: number;
}

export function StopCard({ title, subtitle, minutes }: StopCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftRow}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="directions-bus" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
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
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
    backgroundColor: "#FCD34D",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    overflow: "hidden",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
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
