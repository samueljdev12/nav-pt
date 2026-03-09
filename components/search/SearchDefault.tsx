import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { StopCard } from "../cards/stop-card";

interface StopItem {
  id: string;
  title: string;
  subtitle: string;
  minutes?: number;
  color?: string;
  textColor?: string;
  mode?: string;
}

interface SearchDefaultProps {
  nearbyStops: StopItem[];
}

const MOCK_RECENT_LOCATIONS = [
  {
    id: "recent-001",
    name: "Flinders Street Station",
    address: "Flinders St, Melbourne",
  },
  {
    id: "recent-002",
    name: "Southern Cross Station",
    address: "Spencer St, Melbourne",
  },
  {
    id: "recent-003",
    name: "Southbank Parklands",
    address: "Southbank, Melbourne",
  },
];

export function SearchDefault({ nearbyStops }: SearchDefaultProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Recent Locations ── */}
      <Text style={styles.sectionHeader}>Recent Locations</Text>
      <View style={styles.recentList}>
        {MOCK_RECENT_LOCATIONS.map((location) => (
          <Pressable
            key={location.id}
            style={styles.recentItem}
            onPress={() => console.log("Navigate to", location.name)}
          >
            <View style={styles.recentIcon}>
              <MaterialIcons name="location-on" size={18} color="#6B7280" />
            </View>
            <View style={styles.recentText}>
              <Text style={styles.recentName}>{location.name}</Text>
              <Text style={styles.recentAddress}>{location.address}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* ── Nearby ── */}
      <Text style={styles.sectionHeader}>Nearby</Text>
      {nearbyStops.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📡</Text>
          <Text style={styles.emptyTitle}>No nearby stops found</Text>
          <Text style={styles.emptySubtitle}>
            Try moving to a different location.
          </Text>
        </View>
      ) : (
        <View style={styles.stopsList}>
          {nearbyStops.map((stop) => (
            <View key={stop.id} style={styles.listItem}>
              <StopCard
                title={stop.title}
                subtitle={stop.subtitle}
                minutes={stop.minutes}
                color={stop.color}
                textColor={stop.textColor}
                mode={stop.mode}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  recentList: {
    marginBottom: 16,
    gap: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recentText: {
    flex: 1,
  },
  recentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  recentAddress: {
    fontSize: 12,
    color: "#6B7280",
  },
  stopsList: {
    gap: 12,
    marginBottom: 16,
  },
  listItem: {
    width: "100%",
    paddingTop: 14,
    position: "relative",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});
