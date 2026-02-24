/**
 * Convert hex color to RGBA format
 * @param hex - Hex color code (with or without #)
 * @param opacity - Opacity value from 0 to 1 (default: 1)
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, opacity: number = 1): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get a lighter version of a hex color
 * @param hex - Hex color code (with or without #)
 * @param opacity - Opacity for light gradient effect (default: 0.15)
 * @returns RGBA color string with light effect
 */
export function getLighterColor(hex: string, opacity: number = 0.15): string {
  return hexToRgba(hex, opacity);
}
