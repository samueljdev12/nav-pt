import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
} from "react-native";
import { hexToRgba } from "@/utils/colorUtils";
import { getModeIcon } from "@/utils/iconUtils";

type Maybe<T> = T | undefined;

/**
 * RouteIcon
 * - Displays the mode icon (PNG) inside a circular background.
 * - Accepts either an explicit `icon` source or a `mode` string (BUS/TRAIN/TRAM).
 * - `bgColor` and `tintColor` accept hex strings (with or without '#').
 */
export function RouteIcon({
  mode,
  icon,
  bgColor,
  tintColor,
  size = 34,
  style,
}: {
  mode?: string;
  icon?: ImageSourcePropType;
  bgColor?: string;
  tintColor?: string;
  size?: number;
  style?: ViewStyle;
}) {
  const source = icon ?? getModeIcon(mode ?? "BUS");
  const normalizedBg = bgColor
    ? `#${String(bgColor).replace(/^#/, "")}`
    : "#F97316";
  const normalizedTint = tintColor
    ? `#${String(tintColor).replace(/^#/, "")}`
    : "#FFFFFF";

  return (
    <View
      style={[
        primitives.iconCircle,
        {
          backgroundColor: normalizedBg,
          height: size,
          width: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${mode ?? "transport"} icon`}
    >
      <Image
        source={source}
        style={[primitives.iconImage, { tintColor: normalizedTint }]}
        resizeMode="contain"
      />
    </View>
  );
}

/**
 * CardTitle
 * - Simple consistent title element for stop cards.
 * - Matches typography across carousel and modal cards.
 */
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={primitives.title} numberOfLines={1} accessibilityRole="header">
      {children}
    </Text>
  );
}

/**
 * CardSubtitle
 * - A pill-style subtitle that uses the route color and text color.
 * - `bgColor` and `textColor` accept hex (with/without '#').
 */
export function CardSubtitle({
  children,
  bgColor,
  textColor,
  style,
}: {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  style?: ViewStyle;
}) {
  const pillBg = bgColor ? `#${String(bgColor).replace(/^#/, "")}` : "#FCD34D";
  const txt = textColor ? `#${String(textColor).replace(/^#/, "")}` : "#111827";

  return (
    <View style={[primitives.subtitlePill, { backgroundColor: pillBg }, style]}>
      <Text style={[primitives.subtitleText, { color: txt }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

/**
 * MinutesPill
 * - Small pill that displays minutes (used in carousel StopCard).
 * - Uses the route color for background and textColor for text.
 */
export function MinutesPill({
  minutes,
  bgColor,
  textColor,
  style,
}: {
  minutes?: number | string;
  bgColor?: string;
  textColor?: string;
  style?: ViewStyle;
}) {
  const pillBg = bgColor ? `#${String(bgColor).replace(/^#/, "")}` : "#F97316";
  const txt = textColor ? `#${String(textColor).replace(/^#/, "")}` : "#FFFFFF";

  return (
    <View style={[primitives.minutesBox, { backgroundColor: pillBg }, style]}>
      <Text
        style={[primitives.minutesValue, { color: txt }]}
        accessibilityRole="text"
      >
        {minutes ?? ""}
      </Text>
      <Text
        style={[primitives.minutesLabel, { color: txt }]}
        accessibilityRole="text"
      >
        min
      </Text>
    </View>
  );
}

/**
 * Shared primitive styles used by both card variants.
 * Keep these consistent so typography/spacing match.
 */
const primitives = StyleSheet.create({
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconImage: {
    height: 20,
    width: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    width: "100%",
    backgroundColor: "#dddddd",
    borderRadius: 18,
  },
  subtitlePill: {
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 1,
    maxWidth: "100%",
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: "700",
  },
  minutesBox: {
    alignItems: "center",
    marginLeft: 12,
    minWidth: 62,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: "center",
  },
  minutesValue: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 20,
  },
  minutesLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
});

export default {
  RouteIcon,
  CardTitle,
  CardSubtitle,
  MinutesPill,
};
