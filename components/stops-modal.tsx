import React, { useEffect, useRef } from "react";
import {
    Animated,
    FlatList,
    Modal,
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
}

export function StopsModal({ visible, stops, onClose }: StopsModalProps) {
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

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handle} />
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
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
    maxHeight: "70%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
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
