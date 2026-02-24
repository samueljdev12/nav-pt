import React, { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { StopCard } from "@/components/stop-card";

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

export function StopsCarousel({ stops }: StopsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");
  const cardWidth = useMemo(() => Math.min(320, width - 64), [width]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>YOUR Stops</Text>
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
          setActiveIndex(Math.max(0, Math.min(index, stops.length - 1)));
        }}
      >
        {stops.map((stop) => (
          <View key={stop.id} style={[styles.cardWrap, { width: cardWidth }]}>
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
      </ScrollView>
      <View style={styles.dots}>
        {stops.map((stop, index) => (
          <View
            key={stop.id}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  header: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },
  scrollContent: {
    gap: 12,
  },
  cardWrap: {
    alignSelf: "center",
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
});
