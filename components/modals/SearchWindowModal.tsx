import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { StopCard } from "../cards/stop-card";
import { PlusBadge } from "../badges/PlusBadge";
import { MinusBadge } from "../badges/MinusBadge";
import { useFavourites } from "@/hooks/use-favourites";
import { FavouriteStop } from "@/types/favourites";

export interface StopItem {
  id: string;
  title: string;
  subtitle: string;
  minutes?: number;
  color?: string;
  textColor?: string;
  mode?: string;
}

export interface SearchWindowModalProps {
  visible: boolean;
  onClose: () => void;
  nearbyStops?: StopItem[];
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

export function SearchWindowModal({
  visible,
  onClose,
  nearbyStops = [],
}: SearchWindowModalProps) {
  const { favourites, filterUnfavourited, addFavourite, removeFavourite } =
    useFavourites();

  const availableNearby = useMemo(
    () => filterUnfavourited(nearbyStops),
    [nearbyStops, filterUnfavourited],
  );

  if (!visible) return null;

  const toFavourite = (item: StopItem): FavouriteStop => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    color: item.color,
    textColor: item.textColor,
    mode: item.mode,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Search</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close search"
            >
              <MaterialIcons name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionHeader}>Recent Locations</Text>
            <View style={styles.recentList}>
              {MOCK_RECENT_LOCATIONS.map((location) => (
                <Pressable
                  key={location.id}
                  style={styles.recentItem}
                  onPress={() => console.log("Navigate to", location.name)}
                >
                  <View style={styles.recentIcon}>
                    <MaterialIcons
                      name="location-on"
                      size={18}
                      color="#6B7280"
                    />
                  </View>
                  <View style={styles.recentText}>
                    <Text style={styles.recentName}>{location.name}</Text>
                    <Text style={styles.recentAddress}>{location.address}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Your Stops</Text>
            {favourites.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🚏</Text>
                <Text style={styles.emptyTitle}>No saved stops yet</Text>
                <Text style={styles.emptySubtitle}>
                  Save stops to access them quickly here.
                </Text>
              </View>
            ) : (
              <View style={styles.stopsList}>
                {favourites.map((stop) => (
                  <View key={stop.id} style={styles.listItem}>
                    <StopCard
                      title={stop.title}
                      subtitle={stop.subtitle}
                      color={stop.color}
                      textColor={stop.textColor}
                      mode={stop.mode}
                    />
                    <MinusBadge
                      onPress={() => removeFavourite(stop.id)}
                      style={styles.floatingBadge}
                    />
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.sectionHeader}>Nearby</Text>
            {availableNearby.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📡</Text>
                <Text style={styles.emptyTitle}>
                  {nearbyStops.length === 0
                    ? "No nearby stops found"
                    : "All nearby stops saved!"}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {nearbyStops.length === 0
                    ? "Try moving to a different location."
                    : "Check back for more stops nearby."}
                </Text>
              </View>
            ) : (
              <View style={styles.stopsList}>
                {availableNearby.map((stop) => (
                  <View key={stop.id} style={styles.listItem}>
                    <StopCard
                      title={stop.title}
                      subtitle={stop.subtitle}
                      minutes={stop.minutes}
                      color={stop.color}
                      textColor={stop.textColor}
                      mode={stop.mode}
                    />
                    <PlusBadge
                      onPress={() => addFavourite(toFavourite(stop))}
                      style={styles.floatingBadge}
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    flex: 0.9,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
    marginRight: -8,
  },
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
    marginBottom: 3,
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
  stopItem: {
    width: "100%",
  },
  listItem: {
    width: "100%",
    paddingTop: 14,
    position: "relative",
  },
  floatingBadge: {
    position: "absolute",
    top: 0,
    right: 8,
    zIndex: 10,
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
