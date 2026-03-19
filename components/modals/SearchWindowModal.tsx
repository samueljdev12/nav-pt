import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SearchInput } from "../search/SearchInput";
import { SearchDefault } from "../search/SearchDefault";
import { PlaceDetailCard } from "../cards/place-detail-card";
import { retrieve } from "@/api/mapbox-search";

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

interface MapboxSuggestion {
  name: string;
  mapbox_id: string;
  place_formatted: string;
  feature_type?: "place" | "address" | "poi";
  context?: {
    country?: {
      name: string;
      country_code: string;
    };
    region?: {
      name: string;
      region_code: string;
    };
    place?: {
      name: string;
    };
    address?: {
      name: string;
      street_name?: string;
    };
  };
  distance?: number;
}

interface PlaceDetail {
  name: string;
  fullAddress: string;
  placeFormatted: string;
  coordinates: { longitude: number; latitude: number };
  featureType: string;
  region?: string;
  postcode?: string;
}

function extractPlaceDetail(feature: any): PlaceDetail | null {
  if (!feature) return null;

  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates;
  const context = props.context || {};

  return {
    name: props.name || props.full_address || "Unknown",
    fullAddress: props.full_address || props.place_formatted || "",
    placeFormatted: props.place_formatted || "",
    coordinates: {
      longitude: coords?.[0] ?? 0,
      latitude: coords?.[1] ?? 0,
    },
    featureType: props.feature_type || "place",
    region: context.region?.name,
    postcode: context.postcode?.name,
  };
}

export function SearchWindowModal({
  visible,
  onClose,
  nearbyStops = [],
}: SearchWindowModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const hasSearch = searchQuery.trim().length > 0;

  const handleSuggestionTap = async (suggestion: MapboxSuggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    setLoading(true);

    const feature = await retrieve(suggestion.mapbox_id);
    const detail = extractPlaceDetail(feature);
    setSelectedPlace(detail);
    setLoading(false);
  };

  const handleClearPlace = () => {
    setSelectedPlace(null);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setSelectedPlace(null);
  };

  return (
    <View
      style={[
        styles.overlay,
        visible ? { display: "flex" } : { display: "none" },
      ]}
    >
      <View style={styles.spacer} />
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
            onChangeText={handleSearchChange}
            onSuggestionsChange={setSuggestions}
            placeholder="Search address or stop..."
          />
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#71BE46" />
            <Text style={styles.loadingText}>Fetching details...</Text>
          </View>
        ) : selectedPlace ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <PlaceDetailCard
              name={selectedPlace.name}
              fullAddress={selectedPlace.fullAddress}
              placeFormatted={selectedPlace.placeFormatted}
              coordinates={selectedPlace.coordinates}
              featureType={selectedPlace.featureType}
              region={selectedPlace.region}
              postcode={selectedPlace.postcode}
              onClose={handleClearPlace}
            />
          </ScrollView>
        ) : hasSearch ? (
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
                      onPress={() => handleSuggestionTap(suggestion)}
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
                        <Text style={styles.suggestionPlace} numberOfLines={1}>
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
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    bottom: 130,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
    borderRadius: 24,
    overflow: "hidden",
  },
  spacer: {
    display: "none",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
});
