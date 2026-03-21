import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface PlaceDetailCardProps {
  name: string;
  fullAddress: string;
  placeFormatted?: string;
  coordinates: { longitude: number; latitude: number };
  featureType: string;
  region?: string;
  postcode?: string;
  onClose: () => void;
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
  place: "City / Town",
};

export function PlaceDetailCard({
  name,
  fullAddress,
  placeFormatted,
  coordinates,
  featureType,
  region,
  postcode,
  onClose,
  onNavigate,
}: PlaceDetailCardProps) {
  const icon = FEATURE_TYPE_ICONS[featureType] || "location-on";
  const typeLabel = FEATURE_TYPE_LABELS[featureType] || "Location";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialIcons name={icon} size={22} color="#FFFFFF" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.typeLabel}>{typeLabel}</Text>
        </View>

        <Pressable onPress={onClose} hitSlop={10} style={styles.closeButton}>
          <MaterialIcons name="close" size={20} color="#9CA3AF" />
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsSection}>
        <DetailRow icon="location-on" value={fullAddress} />

        {placeFormatted && <DetailRow icon="near-me" value={placeFormatted} />}

        {region && postcode && (
          <DetailRow icon="map" value={`${region} ${postcode}`} />
        )}

        <DetailRow
          icon="my-location"
          value={`${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`}
        />
      </View>

      {onNavigate && (
        <Pressable onPress={onNavigate} style={styles.navigateButton}>
          <MaterialIcons name="directions" size={20} color="#FFFFFF" />
          <Text style={styles.navigateText}>Get Directions</Text>
        </Pressable>
      )}
    </View>
  );
}

function DetailRow({
  icon,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={16} color="#71BE46" />
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#71BE46",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    paddingTop: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71BE46",
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
    marginRight: -4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  detailsSection: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#4B5563",
    lineHeight: 18,
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#71BE46",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  navigateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
