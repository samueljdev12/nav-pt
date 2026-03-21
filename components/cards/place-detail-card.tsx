import React from "react";
import { StyleSheet, Text, View, Pressable, Share } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PlaceDetail } from "@/types/mapbox";

interface PlaceDetailCardProps {
  place: PlaceDetail;
  isFavourite?: boolean;
  onClose: () => void;
  onFavouriteToggle?: () => void;
  onNavigate?: () => void;
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
  const typeLabel = FEATURE_TYPE_LABELS[place.featureType] || "Location";

  const coordinateText = `${place.coordinates.latitude.toFixed(5)}, ${place.coordinates.longitude.toFixed(5)}`;

  const regionPostcode = [place.region, place.postcode]
    .filter(Boolean)
    .join(" ");

  const handleShare = async () => {
    const message = `${place.name}\n${place.fullAddress}\n\nhttps://maps.google.com/?q=${place.coordinates.latitude},${place.coordinates.longitude}`;
    await Share.share({ message });
  };

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
          <Text style={styles.typeLabel}>{typeLabel}</Text>
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
              name={isFavourite ? "favorite" : "favorite-border"}
              size={26}
              color="#71BE46"
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

        <Text style={styles.coordinateText}>{coordinateText}</Text>
      </View>

      <View style={styles.actions}>
        {onNavigate && (
          <Pressable
            onPress={onNavigate}
            style={styles.primaryButton}
            accessibilityLabel="Get directions"
          >
            <MaterialIcons name="directions" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Get Directions</Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleShare}
          style={styles.secondaryButton}
          accessibilityLabel="Share location"
        >
          <MaterialIcons name="share" size={18} color="#71BE46" />
          <Text style={styles.secondaryButtonText}>Share Location</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
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
});
