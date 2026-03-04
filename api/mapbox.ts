import axios from "axios";

const manboxPublicKey = process.env.EXPO_PUBLIC_MAP_BOX_API;

if (!manboxPublicKey) {
  console.warn("⚠️ EXPO_PUBLIC_MAPBOX_API is not set in .env");
}

const mapboxClient = axios.create({
  baseURL: "https://api.mapbox.com/search/searchbox/v1",
  timeout: 10000,
});

// Generate session token for grouping requests (for billing purposes)
const generateSessionToken = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

let sessionToken = generateSessionToken();

/**
 * Reset session token (call this when user starts a new search session)
 */
export function resetSessionToken() {
  sessionToken = generateSessionToken();
}

export interface MapboxSuggestion {
  name: string;
  name_preferred?: string;
  mapbox_id: string;
  feature_type: string;
  address?: string;
  full_address?: string;
  place_formatted: string;
  context: {
    country?: { name: string; country_code: string };
    region?: { name: string; region_code: string };
    postcode?: { name: string };
    district?: { name: string };
    place?: { name: string };
    locality?: { name: string };
    neighborhood?: { name: string };
    address?: { name: string; address_number?: string; street_name?: string };
    street?: { name: string };
  };
  language: string;
  maki?: string;
  poi_category?: string[];
  distance?: number;
}

export interface MapboxSuggestResponse {
  suggestions: MapboxSuggestion[];
  attribution: string;
}

export interface MapboxRetrieveFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    name: string;
    mapbox_id: string;
    feature_type: string;
    full_address?: string;
    address?: string;
    place_formatted?: string;
    coordinates: {
      longitude: number;
      latitude: number;
      accuracy?: string;
    };
    context: MapboxSuggestion["context"];
    maki?: string;
    poi_category?: string[];
  };
}

export interface MapboxRetrieveResponse {
  type: "FeatureCollection";
  features: MapboxRetrieveFeature[];
  attribution: string;
}

/**
 * Get autocomplete suggestions based on user query
 * This is called as the user types
 * @param query - User's search query
 * @param proximity - Optional [lng, lat] to bias results
 * @returns Array of suggestions
 */
export async function suggestMapboxPlaces(
  query: string,
  proximity?: [number, number],
): Promise<MapboxSuggestion[]> {
  try {
    if (!query.trim()) {
      return [];
    }

    const params: Record<string, any> = {
      q: query,
      access_token: manboxPublicKey,
      session_token: sessionToken,
      country: "AU",
      limit: 8,
      types: "place,address,poi",
      language: "en",
    };

    if (proximity) {
      params.proximity = `${proximity[0]},${proximity[1]}`;
    }

    const response = await mapboxClient.get<MapboxSuggestResponse>("/suggest", {
      params,
    });

    return response.data.suggestions || [];
  } catch (error) {
    return [];
  }
}

/**
 * Retrieve full details for a suggested result
 * Call this when user selects a suggestion
 * @param mapboxId - The mapbox_id from a suggestion
 * @returns Full feature details with coordinates
 */
export async function retrieveMapboxPlace(
  mapboxId: string,
): Promise<MapboxRetrieveFeature | null> {
  try {
    if (!mapboxId) {
      return null;
    }

    const params = {
      access_token: manboxPublicKey,
      session_token: sessionToken,
      language: "en",
    };

    const response = await mapboxClient.get<MapboxRetrieveResponse>(
      `/retrieve/${mapboxId}`,
      { params },
    );

    const feature = response.data.features?.[0];
    console.log("Mapbox Retrieved Feature:", feature);
    return feature || null;
  } catch (error) {
    console.error("Mapbox retrieve error:", error);
    return null;
  }
}

export default mapboxClient;
