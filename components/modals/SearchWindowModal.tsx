import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { SearchInput } from "../search/SearchInput";
import { SearchDefault } from "../search/SearchDefault";
import { MapboxSuggestion } from "@/api/mapbox";

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
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);

  if (!visible) return null;

  const hasSearch = searchQuery.trim().length > 0;

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
            <Pressable
              onPress={onClose}
              style={styles.backButton}
              accessibilityLabel="Close search"
            >
              <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <Text style={styles.headerTitle}>Search</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.inputWrapper}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSuggestionsChange={setSuggestions}
              placeholder="Search address or stop..."
            />
          </View>

          {hasSearch ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {suggestions.length > 0 ? (
                <View>
                  <Text style={styles.sectionHeader}>Suggestions</Text>
                  <View style={styles.suggestionsList}>
                    {suggestions.map((suggestion) => (
                      <Pressable
                        key={suggestion.mapbox_id}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setSearchQuery(suggestion.place_formatted);
                          setSuggestions([]);
                        }}
                      >
                        <View style={styles.iconContainer}>
                          <MaterialIcons
                            name="location-on"
                            size={18}
                            color="#6B7280"
                          />
                        </View>
                        <View style={styles.textContainer}>
                          <Text style={styles.suggestionName} numberOfLines={1}>
                            {suggestion.name}
                          </Text>
                          <Text
                            style={styles.suggestionPlace}
                            numberOfLines={1}
                          >
                            {suggestion.place_formatted}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No suggestions found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try searching for a different address or location.
                  </Text>
                </View>
              )}
            </ScrollView>
          ) : (
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
  backButton: {
    padding: 4,
    marginLeft: -8,
  },
  inputWrapper: {
    marginBottom: 12,
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
    paddingHorizontal: 16,
  },
  suggestionsList: {
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  suggestionPlace: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    gap: 6,
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
