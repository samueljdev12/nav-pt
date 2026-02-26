import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { StopCard } from "../cards/stop-card";
import { PlusBadge } from "../badges/PlusBadge";
import { useFavourites } from "@/hooks/use-favourites";
import { FavouriteStop } from "@/types/favourites";

export interface StopItem {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  color?: string;
  textColor?: string;
  mode?: string;
}

export interface StopsModalProps {
  visible: boolean;
  stops: StopItem[];
  onClose: () => void;
  topOffset?: number;
  bottomOffset?: number;
}

const BADGE_OVERLAP = 14;

export function StopsModal({
  visible,
  stops,
  onClose,
  topOffset = 90,
  bottomOffset = 0,
}: StopsModalProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const { favourites, addFavourite } = useFavourites();

  useEffect(() => {
    if (visible) {
      translateY.setValue(300);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

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
    <Animated.View
      style={[
        styles.sheet,
        {
          top: topOffset,
          bottom: bottomOffset,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <View style={styles.handle} />
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
          accessibilityLabel="Close modal"
        >
          <MaterialIcons name="close" size={24} color="#374151" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Your Stops ── */}
        <Text style={styles.sectionHeader}>Your Stops</Text>

        {favourites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚏</Text>
            <Text style={styles.emptyTitle}>No saved stops yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + on any nearby stop below to save it here.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {favourites.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <StopCard
                  title={item.title}
                  subtitle={item.subtitle}
                  color={item.color}
                  textColor={item.textColor}
                  mode={item.mode}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Nearby ── */}
        <Text style={styles.sectionHeader}>Nearby</Text>

        {stops.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📡</Text>
            <Text style={styles.emptyTitle}>No nearby stops found</Text>
            <Text style={styles.emptySubtitle}>
              Try moving to a different location.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {stops.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <StopCard
                  title={item.title}
                  subtitle={item.subtitle}
                  minutes={item.minutes}
                  color={item.color}
                  textColor={item.textColor}
                  mode={item.mode}
                />
                <PlusBadge
                  onPress={() => addFavourite(toFavourite(item))}
                  style={styles.floatingBadge}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
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
  list: {
    gap: 12,
  },
  listItem: {
    width: "100%",
    paddingTop: BADGE_OVERLAP,
    position: "relative",
  },
  floatingBadge: {
    position: "absolute",
    top: 0,
    right: 3,
    zIndex: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 28,
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
