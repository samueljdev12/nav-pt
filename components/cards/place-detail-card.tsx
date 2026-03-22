import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Share } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PlaceDetail } from "@/types/mapbox";

interface PlaceDetailCardProps {
  place: PlaceDetail;
  isFavourite?: boolean;
  onClose: () => void;
  onFavouriteToggle?: () => void;
  // onNavigate now receives an optional travel mode string ('walk' | 'run' | 'cycle' | 'wheelchair')
  onNavigate?: (mode?: string) => void;
}

const FEATURE_TYPE_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> =
  {
    poi: "place",
    address: "home",
    place: "location-city",
  };

const FEATURE_TYPE_LABELS: Record<string, string> = {
  poi: "Point of Interest",
  address: "Address",
  place: "Location",
};

export function PlaceDetailCard({
  place,
  isFavourite = false,
  onClose,
  onFavouriteToggle,
  onNavigate,
}: PlaceDetailCardProps) {
  const icon = FEATURE_TYPE_ICONS[place.featureType] || "location-on";
  const [travelMode, setTravelMode] = useState<
    "walk" | "run" | "cycle" | "wheelchair"
  >("walk");

  const regionPostcode = [place.region, place.postcode]
    .filter(Boolean)
    .join(" ");

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onClose}
        hitSlop={12}
        style={styles.closeButton}
        accessibilityLabel="Close place details"
      >
        <MaterialIcons name="close" size={18} color="#9CA3AF" />
      </Pressable>

      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialIcons name={icon} size={28} color="#FFFFFF" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={2}>
            {place.name}
          </Text>
        </View>

        {onFavouriteToggle && (
          <Pressable
            onPress={onFavouriteToggle}
            hitSlop={10}
            style={styles.heartButton}
            accessibilityLabel={
              isFavourite ? "Remove from favourites" : "Add to favourites"
            }
          >
            <MaterialIcons
              name={isFavourite ? "star" : "star-border"}
              size={26}
              color="#FFD700"
            />
          </Pressable>
        )}
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.detailText} numberOfLines={2}>
          {place.fullAddress}
        </Text>

        {regionPostcode.length > 0 && (
          <Text style={styles.detailText} numberOfLines={1}>
            {regionPostcode}
          </Text>
        )}
      </View>

      {/* Mode selector: choose how the user will travel to the stop */}
      <Text style={styles.modeHelperText}>
        Select how you'll travel — this affects estimated arrival time and route
        preferences.
      </Text>
      <View style={styles.modeSelector}>
        <Pressable
          style={[
            styles.modeButton,
            travelMode === "walk" && styles.modeButtonActive,
          ]}
          onPress={() => setTravelMode("walk")}
          accessibilityLabel="Select walking (normal) mode"
        >
          <MaterialIcons
            name="directions-walk"
            size={16}
            color={travelMode === "walk" ? "#FFFFFF" : "#374151"}
            style={styles.modeIcon}
          />
          <Text
            style={[
              styles.modeButtonText,
              travelMode === "walk" && styles.modeButtonTextActive,
            ]}
          >
            Walk
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            travelMode === "run" && styles.modeButtonActive,
          ]}
          onPress={() => setTravelMode("run")}
          accessibilityLabel="Select running mode"
        >
          <MaterialIcons
            name="directions-run"
            size={16}
            color={travelMode === "run" ? "#FFFFFF" : "#374151"}
            style={styles.modeIcon}
          />
          <Text
            style={[
              styles.modeButtonText,
              travelMode === "run" && styles.modeButtonTextActive,
            ]}
          >
            Run
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            travelMode === "cycle" && styles.modeButtonActive,
          ]}
          onPress={() => setTravelMode("cycle")}
          accessibilityLabel="Select cycling mode"
        >
          <MaterialIcons
            name="directions-bike"
            size={16}
            color={travelMode === "cycle" ? "#FFFFFF" : "#374151"}
            style={styles.modeIcon}
          />
          <Text
            style={[
              styles.modeButtonText,
              travelMode === "cycle" && styles.modeButtonTextActive,
            ]}
          >
            Cycle
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            travelMode === "wheelchair" && styles.modeButtonActive,
          ]}
          onPress={() => setTravelMode("wheelchair")}
          accessibilityLabel="Select wheelchair mode"
        >
          <MaterialIcons
            name="accessible"
            size={16}
            color={travelMode === "wheelchair" ? "#FFFFFF" : "#374151"}
            style={styles.modeIcon}
          />
          <Text
            style={[
              styles.modeButtonText,
              travelMode === "wheelchair" && styles.modeButtonTextActive,
            ]}
          >
            Wheelchair
          </Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        {onNavigate && (
          <Pressable
            onPress={() => onNavigate && onNavigate(travelMode)}
            style={styles.primaryButton}
            accessibilityLabel="Get directions"
          >
            <MaterialIcons name="directions" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Directions</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingRight: 28,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#71BE46",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 26,
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  heartButton: {
    padding: 4,
    marginLeft: 8,
  },
  detailsSection: {
    gap: 4,
    marginBottom: 18,
  },
  detailText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 22,
  },
  coordinateText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#71BE46",
    borderRadius: 16,
    paddingVertical: 14,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#71BE46",
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#71BE46",
  },
  // Mode selector styles
  modeHelperText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  modeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    flex: 1,
    minWidth: "40%",
  },
  modeButtonActive: {
    backgroundColor: "#71BE46",
  },
  modeIcon: {
    marginRight: 4,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  modeButtonTextActive: {
    color: "#FFFFFF",
  },
});
