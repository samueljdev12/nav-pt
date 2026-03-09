import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName =
  | "house.fill"
  | "clock.fill"
  | "bell.fill"
  | "plus.circle.fill"
  | "paperplane.fill"
  | "chevron.left.forwardslash.chevron.right"
  | "chevron.right";

type IconMapping = Record<IconSymbolName, string>;

/**
 * Material Icons mapping for consistent icon display across all platforms (iOS, Android, Web).
 * This ensures a unified look and feel across all devices.
 */
const MAPPING: IconMapping = {
  "house.fill": "home",
  "clock.fill": "access-time",
  "bell.fill": "notifications",
  "plus.circle.fill": "add",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
};

/**
 * An icon component that uses Material Icons across all platforms (iOS, Android, Web).
 * This ensures consistent appearance and behavior everywhere.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
