import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState, useMemo } from "react";
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
import { SearchInput } from "../search/SearchInput";
import { SearchDefault } from "../search/SearchDefault";
import { useFavourites } from "@/hooks/use-favourites";

interface StopItem {
  id: string;
  title: string;
  subtitle: string;
  minutes?: number;
  color?: string;
  textColor?: string;
  mode?: string;
}

interface SearchWindowModalProps {
  visible: boolean;
  onClose: () => void;
  nearbyStops?: StopItem[];
}

export function SearchWindowModal({
  visible,
  onClose,
  nearbyStops = [],
}: SearchWindowModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addFavourite } = useFavourites();

  // Simple filter: match title or subtitle
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return nearbyStops.filter(
      (stop) =>
        stop.title.toLowerCase().includes(query) ||
        stop.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery, nearbyStops]);

  const toFavourite = (item: StopItem) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    color: item.color,
    textColor: item.textColor,
    mode: item.mode,
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* ── Header ── */}
          <View style={styles.headerRow}>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close search"
            >
              <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <Text style={styles.headerTitle}>Search</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* ── Search Input ── */}
          <View style={styles.inputWrapper}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search address or stop..."
            />
          </View>

          {/* ── Conditional Render ── */}
          {searchQuery.trim().length > 0 ? (
            // Show search results
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.sectionHeader}>Results</Text>
              {searchResults.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No results found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try searching for a different stop or address.
                  </Text>
                </View>
              ) : (
                <View style={styles.stopsList}>
                  {searchResults.map((stop) => (
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
          ) : (
            // Show default view
            <SearchDefault nearbyStops={nearbyStops} />
          )}
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
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
    marginLeft: -8,
  },
  inputWrapper: {
    marginBottom: 8,
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
  stopsList: {
    gap: 12,
    marginBottom: 16,
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
