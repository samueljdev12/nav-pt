import { ImageSourcePropType } from "react-native";

type TransitMode = "BUS" | "TRAIN" | "TRAM" | string;

/**
 * Map transit mode to the corresponding PNG icon
 * @param mode - The transit mode (BUS, TRAIN, TRAM, etc.)
 * @returns The image source for the icon
 */
export function getModeIcon(mode: TransitMode): ImageSourcePropType {
  switch (mode?.toUpperCase()) {
    case "BUS":
      return require("@/assets/images/bus.png");
    case "TRAIN":
      return require("@/assets/images/train.png");
    case "TRAM":
      return require("@/assets/images/tram.png");
    default:
      return require("@/assets/images/bus.png");
  }
}

/**
 * Get all available transit modes
 */
export const TRANSIT_MODES = {
  BUS: "BUS",
  TRAIN: "TRAIN",
  TRAM: "TRAM",
} as const;
