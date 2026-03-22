import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RouteOption, RouteLeg } from "./RouteOptionsCard";
import { PlaceDetail } from "@/types/mapbox";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpcomingService {
  destination: string;
  via?: string;
  minutesAway: number;
  routeColor?: string;
}

interface JourneyStep {
  id: string;
  type: "WALK" | "TRANSIT" | "TRANSFER" | "ARRIVE";
  locationName: string;
  durationMinutes: number;
  routeShortName?: string;
  routeColor?: string;
  platform?: string;
  instruction?: string;
  upcomingServices?: UpcomingService[];
}

export interface JourneyDetailCardProps {
  route: RouteOption | null;
  destination: PlaceDetail | null;
  onClose: () => void;
  onGo?: () => void;
  topOffset?: number;
  bottomOffset?: number;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  ON_TIME: { label: "On Time", bg: "#DCFCE7", fg: "#16A34A" },
  SLIGHT_DELAY: { label: "Slight Delay", bg: "#FEF3C7", fg: "#D97706" },
  SCHEDULED: { label: "Scheduled", bg: "#F3F4F6", fg: "#6B7280" },
};

// ─── Build journey steps from route legs ─────────────────────────────────────
// Generates a full step-by-step breakdown from the legs array.
// In production, replace with real OTP `itinerary.legs` data.

function buildSteps(
  route: RouteOption,
  destinationName: string,
): JourneyStep[] {
  const steps: JourneyStep[] = [];

  const DUMMY_SERVICES: Record<string, UpcomingService[]> = {
    "86": [
      {
        destination: "City (Bourke St)",
        routeColor: "#0EA5E9",
        minutesAway: 4,
      },
      {
        destination: "Bundoora RMIT",
        via: "via City Loop",
        routeColor: "#0EA5E9",
        minutesAway: 11,
      },
      {
        destination: "City (Bourke St)",
        routeColor: "#0EA5E9",
        minutesAway: 18,
      },
    ],
    Snby: [
      {
        destination: "Flinders Street",
        via: "via City Loop",
        routeColor: "#0EA5E9",
        minutesAway: 4,
      },
      {
        destination: "Sunbury",
        via: "via City Loop",
        routeColor: "#0EA5E9",
        minutesAway: 14,
      },
      {
        destination: "Flinders Street",
        via: "via City Loop",
        routeColor: "#0EA5E9",
        minutesAway: 27,
      },
    ],
    "59": [
      { destination: "Airport West", routeColor: "#F97316", minutesAway: 2 },
      { destination: "Airport West", routeColor: "#F97316", minutesAway: 22 },
    ],
    "401": [
      {
        destination: "Werribee",
        via: "via Altona Loop",
        routeColor: "#71BE46",
        minutesAway: 5,
      },
      { destination: "Williamstown", routeColor: "#71BE46", minutesAway: 14 },
      {
        destination: "Craigieburn",
        via: "via City Loop",
        routeColor: "#71BE46",
        minutesAway: 27,
      },
      {
        destination: "Upfield",
        via: "via City Loop",
        routeColor: "#71BE46",
        minutesAway: 33,
      },
    ],
    Frankston: [
      {
        destination: "Flinders Street",
        via: "via City Loop",
        routeColor: "#10B981",
        minutesAway: 11,
      },
      { destination: "Frankston", routeColor: "#10B981", minutesAway: 8 },
      {
        destination: "Flinders Street",
        via: "via City Loop",
        routeColor: "#10B981",
        minutesAway: 22,
      },
    ],
  };

  const STOP_NAMES: Record<
    string,
    { board: string; alight: string; platform?: string }
  > = {
    "86": {
      board: "Bourke St / Swanston St",
      alight: "St Kilda Rd / Toorak Rd",
      platform: "Stop D",
    },
    Snby: {
      board: "Flinders Street Station",
      alight: "North Melbourne Station",
      platform: "Platform 2",
    },
    "59": {
      board: "Elizabeth St / Flinders St",
      alight: "North Melbourne Station",
      platform: "Stop B",
    },
    "401": {
      board: "Spencer St / Collins St",
      alight: "Southern Cross Station",
      platform: "Bay 14",
    },
    Frankston: {
      board: "Flinders Street Station",
      alight: "Richmond Station",
      platform: "Platform 3",
    },
  };

  let stepId = 0;

  for (let i = 0; i < route.legs.length; i++) {
    const leg: RouteLeg = route.legs[i];
    const nextLeg: RouteLeg | undefined = route.legs[i + 1];
    const isLast = i === route.legs.length - 1;

    if (leg.mode === "WALK") {
      // Determine where this walk is heading
      const towardName = nextLeg
        ? nextLeg.routeShortName
          ? (STOP_NAMES[nextLeg.routeShortName]?.board ?? "next stop")
          : "your destination"
        : destinationName;

      if (i === 0) {
        // First walk — from user location
        steps.push({
          id: `step-${stepId++}`,
          type: "WALK",
          locationName: "Your location",
          durationMinutes: leg.durationMinutes,
          instruction: `Walk ${leg.durationMinutes} min to ${towardName}`,
        });
      } else if (isLast) {
        // Last walk — arriving at destination
        steps.push({
          id: `step-${stepId++}`,
          type: "ARRIVE",
          locationName: destinationName,
          durationMinutes: leg.durationMinutes,
          instruction: `Walk ${leg.durationMinutes} min to arrive`,
        });
      } else {
        // Walk in between (transfer)
        steps.push({
          id: `step-${stepId++}`,
          type: "TRANSFER",
          locationName: `Walk to ${towardName}`,
          durationMinutes: leg.durationMinutes,
          instruction: `${leg.durationMinutes} min walk to next service`,
        });
      }
    } else {
      // Transit leg
      const stopInfo = leg.routeShortName
        ? STOP_NAMES[leg.routeShortName]
        : undefined;
      const services = leg.routeShortName
        ? DUMMY_SERVICES[leg.routeShortName]
        : undefined;

      steps.push({
        id: `step-${stepId++}`,
        type: "TRANSIT",
        locationName: stopInfo?.board ?? "Stop",
        durationMinutes: leg.durationMinutes,
        routeShortName: leg.routeShortName,
        routeColor: leg.routeColor ?? "#4B5563",
        platform: stopInfo?.platform,
        instruction: `Ride for ${leg.durationMinutes} min`,
        upcomingServices: services,
      });
    }
  }

  return steps;
}

// ─── Upcoming services list ───────────────────────────────────────────────────

function ServiceList({ services }: { services: UpcomingService[] }) {
  return (
    <View style={svcStyles.list}>
      {services.map((svc, i) => (
        <View key={i} style={svcStyles.row}>
          <View
            style={[
              svcStyles.dot,
              { backgroundColor: svc.routeColor ?? "#4B5563" },
            ]}
          />
          <Text style={svcStyles.dest} numberOfLines={1}>
            {svc.destination}
            {svc.via ? <Text style={svcStyles.via}> {svc.via}</Text> : null}
          </Text>
          <View
            style={[
              svcStyles.badge,
              { backgroundColor: svc.routeColor ?? "#4B5563" },
            ]}
          >
            <Text style={svcStyles.badgeText}>{svc.minutesAway}m</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Single timeline step ─────────────────────────────────────────────────────

function TimelineStep({
  step,
  isLast,
}: {
  step: JourneyStep;
  isLast: boolean;
}) {
  const isWalk = step.type === "WALK" || step.type === "TRANSFER";
  const isArrive = step.type === "ARRIVE";

  const dotColor = isArrive
    ? "#EF4444"
    : isWalk
      ? "#9CA3AF"
      : (step.routeColor ?? "#4B5563");

  return (
    <View style={tlStyles.row}>
      {/* Left: dot + vertical line */}
      <View style={tlStyles.lineCol}>
        <View style={[tlStyles.dot, { backgroundColor: dotColor }]}>
          <MaterialIcons
            name={
              isArrive
                ? "location-on"
                : isWalk
                  ? "directions-walk"
                  : step.routeShortName
                    ? step.type === "TRANSIT"
                      ? "directions-transit"
                      : "swap-horiz"
                    : "directions-transit"
            }
            size={13}
            color="#FFFFFF"
          />
        </View>
        {!isLast && <View style={tlStyles.line} />}
      </View>

      {/* Right: content */}
      <View style={tlStyles.content}>
        {/* Step header */}
        <View style={tlStyles.headerRow}>
          <Text style={tlStyles.locationName} numberOfLines={2}>
            {step.locationName}
          </Text>
          {!isWalk && !isArrive && (
            <View
              style={[tlStyles.durationBadge, { backgroundColor: dotColor }]}
            >
              <Text style={tlStyles.durationBadgeText}>
                {step.durationMinutes}min
              </Text>
            </View>
          )}
        </View>

        {/* Sub info */}
        {step.platform ? (
          <Text style={tlStyles.subInfo}>{step.platform}</Text>
        ) : null}

        {step.instruction ? (
          <Text style={tlStyles.instruction}>{step.instruction}</Text>
        ) : null}

        {/* Route chip */}
        {step.routeShortName && !isWalk && (
          <View style={tlStyles.routeChipRow}>
            <View
              style={[
                tlStyles.routeChip,
                { backgroundColor: step.routeColor ?? "#4B5563" },
              ]}
            >
              <MaterialIcons
                name="directions-transit"
                size={12}
                color="#FFFFFF"
              />
              <Text style={tlStyles.routeChipText}>{step.routeShortName}</Text>
            </View>
          </View>
        )}

        {/* Upcoming services */}
        {step.upcomingServices && step.upcomingServices.length > 0 && (
          <View style={tlStyles.servicesWrap}>
            <ServiceList services={step.upcomingServices} />
          </View>
        )}

        <View style={{ height: isLast ? 0 : 16 }} />
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function JourneyDetailCard({
  route,
  destination,
  onClose,
  onGo,
  topOffset = 28,
  bottomOffset = 90,
}: JourneyDetailCardProps) {
  const translateY = useRef(new Animated.Value(600)).current;

  React.useEffect(() => {
    if (route) {
      translateY.setValue(600);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 13,
      }).start();
    }
  }, [route, translateY]);

  if (!route) return null;

  const stat = STATUS_CONFIG[route.status];
  const destinationName = destination?.name ?? "Destination";
  const steps = buildSteps(route, destinationName);

  return (
    <Animated.View
      style={[
        styles.card,
        { top: topOffset, bottom: bottomOffset, transform: [{ translateY }] },
      ]}
    >
      {/* ── Handle + close ── */}
      <View style={styles.topBar}>
        <View style={styles.handle} />
        <Pressable
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityLabel="Close journey detail"
        >
          <MaterialIcons name="close" size={22} color="#374151" />
        </Pressable>
      </View>

      {/* ── Summary bar ── */}
      <View style={styles.summaryBar}>
        {/* Duration + arrival */}
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryDuration}>{route.totalMinutes}min</Text>
          <Text style={styles.summaryArrival}>Arrive {route.arrivalTime}</Text>
        </View>

        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: stat.bg }]}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText, { color: stat.fg }]}>
            {stat.label}
          </Text>
        </View>

        {/* GO button */}
        <Pressable
          style={styles.goButton}
          onPress={onGo}
          accessibilityLabel="Start navigation"
        >
          <Text style={styles.goButtonText}>GO</Text>
        </Pressable>
      </View>

      {/* ── Timeline steps ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {steps.map((step, index) => (
          <TimelineStep
            key={step.id}
            step={step}
            isLast={index === steps.length - 1}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

// ─── Service list styles ──────────────────────────────────────────────────────

const svcStyles = StyleSheet.create({
  list: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  dest: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  via: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "400",
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

// ─── Timeline step styles ─────────────────────────────────────────────────────

const tlStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  lineCol: {
    alignItems: "center",
    width: 32,
    marginRight: 10,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: "#E5E7EB",
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 3,
  },
  locationName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 19,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    flexShrink: 0,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subInfo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 2,
  },
  instruction: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  routeChipRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  routeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  routeChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  servicesWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
});

// ─── Main card styles ─────────────────────────────────────────────────────────

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
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  topBar: {
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

  // Summary bar
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryDuration: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 26,
  },
  summaryArrival: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  goButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  goButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  // Steps scroll
  scrollContent: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    paddingBottom: 16,
  },
});
