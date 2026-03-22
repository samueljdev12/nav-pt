import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PlaceDetail } from "@/types/mapbox";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LegMode = "WALK" | "BUS" | "TRAM" | "TRAIN";

export interface RouteLeg {
  mode: LegMode;
  durationMinutes: number;
  /** Route short name — transit legs only, e.g. "86", "401", "Frankston" */
  routeShortName?: string;
  /** Hex background colour for the transit chip */
  routeColor?: string;
}

export interface RouteOption {
  id: string;
  departureTime: string; // e.g. "2:45"
  arrivalTime: string; // e.g. "3:13 pm"
  totalMinutes: number;
  status: "ON_TIME" | "SLIGHT_DELAY" | "SCHEDULED";
  /** Minutes until the first departure */
  minutesAway: number;
  fare: string;
  legs: RouteLeg[];
}

export interface RouteOptionsCardProps {
  destination: PlaceDetail | null;
  travelMode?: string;
  onClose: () => void;
  topOffset?: number;
  bottomOffset?: number;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_ROUTES: RouteOption[] = [
  {
    id: "r1",
    departureTime: "2:45",
    arrivalTime: "3:13 pm",
    totalMinutes: 28,
    status: "ON_TIME",
    minutesAway: 9,
    fare: "$5.50*",
    legs: [
      { mode: "WALK", durationMinutes: 9 },
      {
        mode: "TRAM",
        durationMinutes: 14,
        routeShortName: "Snby",
        routeColor: "#0EA5E9",
      },
      { mode: "WALK", durationMinutes: 5 },
    ],
  },
  {
    id: "r2",
    departureTime: "2:52",
    arrivalTime: "3:25 pm",
    totalMinutes: 33,
    status: "SLIGHT_DELAY",
    minutesAway: 0,
    fare: "$5.50*",
    legs: [
      { mode: "WALK", durationMinutes: 4 },
      {
        mode: "BUS",
        durationMinutes: 8,
        routeShortName: "59",
        routeColor: "#F97316",
      },
      { mode: "WALK", durationMinutes: 3 },
      {
        mode: "BUS",
        durationMinutes: 11,
        routeShortName: "401",
        routeColor: "#71BE46",
      },
      { mode: "WALK", durationMinutes: 7 },
    ],
  },
  {
    id: "r3",
    departureTime: "2:50",
    arrivalTime: "3:20 pm",
    totalMinutes: 30,
    status: "ON_TIME",
    minutesAway: 15,
    fare: "$5.50*",
    legs: [
      { mode: "WALK", durationMinutes: 11 },
      {
        mode: "BUS",
        durationMinutes: 12,
        routeShortName: "401",
        routeColor: "#71BE46",
      },
      { mode: "WALK", durationMinutes: 7 },
    ],
  },
  {
    id: "r4",
    departureTime: "2:50",
    arrivalTime: "3:20 pm",
    totalMinutes: 30,
    status: "SCHEDULED",
    minutesAway: 20,
    fare: "$5.50*",
    legs: [
      { mode: "WALK", durationMinutes: 11 },
      {
        mode: "BUS",
        durationMinutes: 12,
        routeShortName: "401",
        routeColor: "#71BE46",
      },
      { mode: "WALK", durationMinutes: 7 },
    ],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  ON_TIME: { label: "On Time", bg: "#DCFCE7", fg: "#16A34A" },
  SLIGHT_DELAY: { label: "Slight Delay", bg: "#FEF3C7", fg: "#D97706" },
  SCHEDULED: { label: "Scheduled", bg: "#F3F4F6", fg: "#6B7280" },
};

// ─── Mode summary tabs (top of card) ─────────────────────────────────────────

const MODE_TABS = [
  { key: "transit", icon: "directions-transit" as const, label: "28 min" },
  { key: "walk", icon: "directions-walk" as const, label: "52 min" },
  { key: "cycle", icon: "directions-bike" as const, label: "35 min" },
];

// ─── LegStrip ─────────────────────────────────────────────────────────────────

function LegStrip({ legs }: { legs: RouteLeg[] }) {
  return (
    <View style={legStyles.strip}>
      {legs.map((leg, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <MaterialIcons name="chevron-right" size={14} color="#9CA3AF" />
          )}

          {leg.mode === "WALK" ? (
            <View style={legStyles.walkChip}>
              <MaterialIcons name="directions-walk" size={13} color="#6B7280" />
              <Text style={legStyles.walkText}>{leg.durationMinutes}m</Text>
            </View>
          ) : (
            <View
              style={[
                legStyles.transitChip,
                { backgroundColor: leg.routeColor ?? "#4B5563" },
              ]}
            >
              <MaterialIcons
                name={
                  leg.mode === "BUS"
                    ? "directions-bus"
                    : leg.mode === "TRAIN"
                      ? "train"
                      : "tram"
                }
                size={12}
                color="#FFFFFF"
              />
              {leg.routeShortName ? (
                <Text style={legStyles.transitRoute}>{leg.routeShortName}</Text>
              ) : null}
              <Text style={legStyles.transitDuration}>
                {leg.durationMinutes}m
              </Text>
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteOptionsCard({
  destination,
  travelMode,
  onClose,
  topOffset = 90,
  bottomOffset = 90,
}: RouteOptionsCardProps) {
  const translateY = useRef(new Animated.Value(500)).current;
  const [activeTab, setActiveTab] = useState("transit");

  React.useEffect(() => {
    translateY.setValue(500);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 70,
      friction: 13,
    }).start();
  }, [translateY]);

  return (
    <Animated.View
      style={[
        styles.card,
        { top: topOffset, bottom: bottomOffset, transform: [{ translateY }] },
      ]}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.handle} />
        <Pressable
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityLabel="Close route options"
        >
          <MaterialIcons name="close" size={22} color="#374151" />
        </Pressable>
      </View>

      {/* ── Origin → Destination ── */}
      <View style={styles.tripRow}>
        <View style={styles.tripPoint}>
          <MaterialIcons name="my-location" size={13} color="#71BE46" />
          <Text style={styles.tripPointText} numberOfLines={1}>
            Your location
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward"
          size={14}
          color="#9CA3AF"
          style={{ marginHorizontal: 4 }}
        />
        <View style={styles.tripPoint}>
          <MaterialIcons name="location-on" size={13} color="#EF4444" />
          <Text style={styles.tripPointText} numberOfLines={1}>
            {destination?.name ?? "Destination"}
          </Text>
        </View>
      </View>

      {/* ── Mode Tabs ── */}
      <View style={styles.modeTabs}>
        {MODE_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.modeTab, active && styles.modeTabActive]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityLabel={`${tab.key} — ${tab.label}`}
            >
              <MaterialIcons
                name={tab.icon}
                size={16}
                color={active ? "#FFFFFF" : "#374151"}
              />
              <Text
                style={[styles.modeTabText, active && styles.modeTabTextActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Route list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.routeList}
      >
        {DUMMY_ROUTES.map((route) => {
          const stat = STATUS_CONFIG[route.status];

          return (
            <Pressable
              key={route.id}
              style={styles.routeCard}
              accessibilityLabel={`Route departing ${route.departureTime}, ${route.totalMinutes} minutes`}
            >
              {/* ── Route card top: time range + status badge + duration ── */}
              <View style={styles.routeTopRow}>
                {/* Left: time range */}
                <Text style={styles.timeRange}>
                  {route.departureTime} – {route.arrivalTime}
                </Text>

                {/* Centre: status + eta */}
                <View
                  style={[styles.statusBadge, { backgroundColor: stat.bg }]}
                >
                  <View
                    style={[styles.statusDot, { backgroundColor: stat.fg }]}
                  />
                  <Text style={[styles.statusText, { color: stat.fg }]}>
                    {stat.label}
                    {route.minutesAway > 0
                      ? ` · ${route.minutesAway} min away`
                      : " · departing now"}
                  </Text>
                </View>

                {/* Right: big duration */}
                <View style={styles.durationBlock}>
                  <Text style={styles.durationNumber}>
                    {route.totalMinutes}
                  </Text>
                  <Text style={styles.durationLabel}>min</Text>
                </View>
              </View>

              {/* ── Leg strip ── */}
              <LegStrip legs={route.legs} />

              {/* ── Fare ── */}
              <Text style={styles.fare}>{route.fare}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

// ─── Leg strip styles ─────────────────────────────────────────────────────────

const legStyles = StyleSheet.create({
  strip: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 3,
    marginBottom: 8,
  },
  walkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  walkText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
  },
  transitChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  transitRoute: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  transitDuration: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
});

// ─── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 6,
  },
  closeBtn: {
    padding: 4,
  },

  // Trip origin→destination row
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  tripPoint: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tripPointText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  // Mode tabs
  modeTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  modeTabActive: {
    backgroundColor: "#71BE46",
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
  },
  modeTabTextActive: {
    color: "#FFFFFF",
  },

  // Route list
  routeList: {
    gap: 10,
    paddingBottom: 8,
  },

  // Individual route card
  routeCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
  },
  routeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 6,
  },
  timeRange: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    flexShrink: 0,
  },
  statusBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    flexShrink: 1,
  },
  durationBlock: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  durationNumber: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 28,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    textAlign: "right",
  },

  // Fare
  fare: {
    fontSize: 13,
    fontWeight: "800",
    color: "#71BE46",
    marginTop: 2,
  },
});
