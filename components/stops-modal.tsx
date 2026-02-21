import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { StopCard } from "@/components/stop-card";

export interface StopItem {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
}

export interface StopsModalProps {
  visible: boolean;
  stops: StopItem[];
  onClose: () => void;
  topOffset?: number;
  bottomOffset?: number;
}

export function StopsModal({
  visible,
  stops,
  onClose,
  topOffset = 90,
  bottomOffset = 0,
}: StopsModalProps) {
  const translateY = useRef(new Animated.Value(0)).current;

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
      <Text style={styles.header}>Nearby</Text>
      <FlatList
        data={stops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <StopCard
              title={item.title}
              subtitle={item.subtitle}
              minutes={item.minutes}
            />
          </View>
        )}
      />
      <Text style={styles.hint}>Swipe up to close</Text>
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
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
    marginRight: -8,
  },
  header: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 8,
  },
  listItem: {
    width: "100%",
  },
  hint: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 6,
  },
});
