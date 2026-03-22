import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PlaceDetail } from "@/types/mapbox";
import { getModeIcon } from "@/utils/iconUtils";

/**
 * TransitOptionsModal
 *
 * Shows dummy public-transport route options between an origin and destination.
 * Designed to match the project's modal/sheet styling patterns (similar to StopsModal).
 *
 * Props:
 * - visible: whether the modal is shown
 * - origin: optional PlaceDetail for the start (can be user location)
 * - destination: required PlaceDetail to travel to
 * - onClose: close callback
 * - onConfirm: called with the selected option when user taps Choose
 *
 * This modal returns dummy/transit options only — it does not call a routing API.
 */

export interface TransitOption {
  id: string;
  mode: "TRAM" | "BUS" | "TRAIN" | string;
  durationMinutes: number;
  transfers: number;
  departureInMinutes: number;
  description?: string;
}

export interface TransitOptionsModalProps {
  visible: boolean;
  origin?: PlaceDetail | null;
  destination?: PlaceDetail | null;
  onClose: () => void;
  onConfirm?: (option: TransitOption) => void;
}

const DEFAULT_OPTIONS: TransitOption[] = [
  {
    id: "opt-1",
    mode: "TRAM",
    durationMinutes: 12,
    transfers: 0,
    departureInMinutes: 4,
    description: "Fast tram with few stops",
  },
  {
    id: "opt-2",
    mode: "BUS",
    durationMinutes: 18,
    transfers: 1,
    departureInMinutes: 2,
    description: "Direct bus, slightly longer but fewer transfers",
  },
  {
    id: "opt-3",
    mode: "TRAIN",
    durationMinutes: 10,
    transfers: 1,
    departureInMinutes: 8,
    description: "Express train — slightly later departure",
  },
];

export function TransitOptionsModal({
  visible,
  origin,
  destination,
  onClose,
  onConfirm,
}: TransitOptionsModalProps) {
  const translateY = useRef(new Animated.Value(300)).current;
  const [options, setOptions] = useState<TransitOption[]>(DEFAULT_OPTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Build dummy options whenever destination changes (could be expanded)
    setOptions(DEFAULT_OPTIONS);
    setSelectedId(null);
  }, [destination]);

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

  const handleChoose = (opt: TransitOption) => {
    if (onConfirm) onConfirm(opt);
    onClose();
  };

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.handle} />
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
          accessibilityLabel="Close transit options"
        >
          <MaterialIcons name="close" size={24} color="#374151" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Public transport options</Text>

        <View style={styles.summary}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>From</Text>
            <Text style={styles.summaryText} numberOfLines={1}>
              {origin?.name ?? "Your location"}
            </Text>
          </View>

          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>To</Text>
            <Text style={styles.summaryText} numberOfLines={1}>
              {destination?.name ?? "Selected place"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Routes</Text>

        <View style={styles.list}>
          {options.map((opt) => {
            const selected = selectedId === opt.id;
            const modeIcon = getModeIcon(opt.mode);

            const departureText =
              opt.departureInMinutes === 0
                ? "departing now"
                : `departs in ${opt.departureInMinutes}m`;

            const transfersText =
              opt.transfers === 0
                ? "no transfers"
                : `${opt.transfers} transfer${opt.transfers > 1 ? "s" : ""}`;

            // Example price (dummy)
            const priceText = "$5.50";

            return (
              <View key={opt.id} style={styles.optionRow}>
                <Pressable
                  style={[
                    styles.routeCard,
                    selected ? styles.routeCardSelected : undefined,
                  ]}
                  onPress={() => setSelectedId(opt.id)}
                  accessibilityLabel={`Select ${opt.mode} route ${opt.id}`}
                >
                  {/* Top meta row: mode chip, time range and status */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.topLeft}>
                      <View style={styles.modeChip}>
                        {typeof modeIcon === "number" ? (
                          <Image
                            source={modeIcon}
                            style={styles.modeImageSmall}
                          />
                        ) : (
                          <MaterialIcons
                            name={
                              opt.mode === "BUS"
                                ? "directions-bus"
                                : opt.mode === "TRAIN"
                                  ? "train"
                                  : "tram"
                            }
                            size={14}
                            color="#FFFFFF"
                          />
                        )}
                      </View>

                      <Text style={styles.timeRange}>
                        {" "}
                        {opt.durationMinutes} min
                      </Text>
                    </View>

                    <View style={styles.topRight}>
                      {/* status chip (on-time/delay) */}
                      <View
                        style={[
                          styles.statusChip,
                          opt.departureInMinutes > 6
                            ? styles.statusDelayed
                            : styles.statusOnTime,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {opt.departureInMinutes > 6
                            ? "Slight delay"
                            : "On time"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Main content: title, description */}
                  <View style={styles.cardMiddle}>
                    <Text style={styles.routeTitle} numberOfLines={1}>
                      {opt.mode} · {opt.description || "Route option"}
                    </Text>

                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>{departureText}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.metaText}>{transfersText}</Text>
                    </View>
                  </View>

                  {/* Bottom row: price and big duration / choose indicator */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.priceWrap}>
                      <Text style={styles.priceText}>{priceText}</Text>
                      <Text style={styles.smallNote}>est fare</Text>
                    </View>

                    <View style={styles.durationWrap}>
                      <Text style={styles.durationBig}>
                        {opt.durationMinutes}m
                      </Text>
                      {selected ? (
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color="#71BE46"
                        />
                      ) : (
                        <MaterialIcons
                          name="chevron-right"
                          size={20}
                          color="#9CA3AF"
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.footerActions}>
          <Pressable
            style={[styles.primaryButton, !selectedId ? styles.disabled : {}]}
            onPress={() => {
              const chosen = options.find((o) => o.id === selectedId);
              if (chosen) handleChoose(chosen);
            }}
            accessibilityLabel="Choose selected transit option"
            disabled={!selectedId}
          >
            <Text style={styles.primaryButtonText}>
              {selectedId ? "Choose route" : "Select a route"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={onClose}
            accessibilityLabel="Cancel transit options"
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 90,
    bottom: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
    marginRight: -8,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  summaryLeft: {
    flex: 1,
    marginRight: 8,
  },
  summaryRight: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  list: {
    gap: 12,
    marginBottom: 12,
  },
  optionRow: {
    width: "100%",
    position: "relative",
  },
  /* richer route card styles */
  routeCard: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  routeCardSelected: {
    borderWidth: 1,
    borderColor: "#71BE46",
    backgroundColor: "#FBFFF8",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  modeImageSmall: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  timeRange: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOnTime: {
    backgroundColor: "#EFFEE9",
  },
  statusDelayed: {
    backgroundColor: "#FFF2E8",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  cardMiddle: {
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceWrap: {
    flexDirection: "column",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#10B981",
  },
  smallNote: {
    fontSize: 12,
    color: "#6B7280",
  },
  durationWrap: {
    alignItems: "flex-end",
  },
  durationBig: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  /* keep placeholder styles for accessibility */
  placeholderDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "transparent",
  },
  footerActions: {
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#71BE46",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  disabled: {
    opacity: 0.55,
  },
  secondaryButton: {
    marginLeft: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
});
