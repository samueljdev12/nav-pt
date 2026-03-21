import axios from "axios";
import { MapboxSuggestion } from "@/types/mapbox";

const API_KEY = process.env.EXPO_PUBLIC_MAP_BOX_API || "";
const BASE_URL = "https://api.mapbox.com/search/searchbox/v1";

// Victoria, Australia bounding box [minLng, minLat, maxLng, maxLat]
const VICTORIA_BBOX = "140.9617,-39.1592,149.9766,-33.9806";

let sessionToken = generateSessionToken();

function generateSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function refreshSession(): void {
  sessionToken = generateSessionToken();
}

export async function suggest(
  query: string,
  proximity?: { longitude: number; latitude: number },
): Promise<MapboxSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed || !API_KEY) return [];

  try {
    const params: Record<string, string | number> = {
      q: trimmed,
      access_token: API_KEY,
      session_token: sessionToken,
      country: "AU",
      language: "en",
      limit: 10,
      bbox: VICTORIA_BBOX,
    };

    if (proximity) {
      params.proximity = `${proximity.longitude},${proximity.latitude}`;
    }

    const response = await axios.get(`${BASE_URL}/suggest`, {
      params,
      timeout: 10000,
    });

    return response.data.suggestions || [];
  } catch (error) {
    console.error("❌ mapbox suggest error:", error);
    return [];
  }
}

export async function retrieve(mapboxId: string): Promise<any | null> {
  if (!mapboxId || !API_KEY) return null;

  try {
    const response = await axios.get(`${BASE_URL}/retrieve/${mapboxId}`, {
      params: {
        access_token: API_KEY,
        session_token: sessionToken,
      },
      timeout: 10000,
    });

    const feature = response.data?.features?.[0] ?? null;
    return feature;
  } catch (error) {
    console.error("❌ mapbox retrieve error:", error);
    return null;
  }
}
