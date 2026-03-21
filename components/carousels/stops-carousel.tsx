import React, { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { StopCard } from "../cards/stop-card";
import { MinuteBadge } from "../badges/MinuteBadge";
import { useFavouriteLocations } from "@/hooks/use-favourite-locations";

export interface StopItem {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  color?: string;
  textColor?: string;
  mode?: string;
}

export interface StopsCarouselProps {
  stops: StopItem[];
}

const BADGE_OVERLAP = 18;

export function StopsCarousel({ stops }: StopsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");
  const cardWidth = useMemo(() => Math.min(320, width - 64), [width]);

  // Load favourite stops from storage
  const { favourites } = useFavouriteLocations();

  // Display saved stops if available, otherwise show mock stops
  const displayStops = favourites.length > 0 ? favourites : stops;
  const isEmpty = displayStops.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>YOUR STOPS</Text>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🚏</Text>
          <Text style={styles.emptyText}>No saved stops yet</Text>
          <Text style={styles.emptySubtext}>
            Search to add your favourite stops
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            contentContainerStyle={styles.scrollContent}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (cardWidth + 12),
              );
              setActiveIndex(
                Math.max(0, Math.min(index, displayStops.length - 1)),
              );
            }}
          >
            {displayStops.map((stop) => (
              <View
                key={stop.id}
                style={[styles.cardWrap, { width: cardWidth }]}
              >
                {/* Card sits below with top padding so the badge has room */}
                <StopCard
                  title={stop.title}
                  subtitle={stop.subtitle}
                  minutes={stop.minutes}
                  color={stop.color}
                  textColor={stop.textColor}
                  mode={stop.mode}
                  style={styles.card}
                />

                {/* MinuteBadge floats at the top-right corner, above the card */}
                {stop.minutes !== undefined && (
                  <MinuteBadge
                    minutes={stop.minutes}
                    style={styles.floatingBadge}
                  />
                )}
              </View>
            ))}
          </ScrollView>

          {/* Pagination dots */}
          <View style={styles.dots}>
            {displayStops.map((stop, index) => (
              <View
                key={stop.id}
                style={[
                  styles.dot,
                  index === activeIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "rgba(113, 190, 70, 0.25)",
  },
  header: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
    color: "#71BE46",
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  scrollContent: {
    gap: 12,
  },
  cardWrap: {
    paddingTop: BADGE_OVERLAP,
    position: "relative",
    alignSelf: "center",
  },
  card: {},
  floatingBadge: {
    position: "absolute",
    top: 0,
    right: -5,
    zIndex: 10,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#111827",
    width: 16,
  },
  dotInactive: {
    backgroundColor: "#CBD5F5",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
