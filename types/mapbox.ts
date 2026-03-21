/**
 * Mapbox API Type Definitions
 * Simplified - only types we actually use
 */

/**
 * Geographic context for a suggestion
 */
export interface MapboxContext {
  country?: {
    name: string;
    country_code: string;
  };
  region?: {
    name: string;
    region_code: string;
  };
  place?: {
    name: string;
  };
  address?: {
    name: string;
    street_name?: string;
  };
}

/**
 * A single suggestion from Mapbox /suggest endpoint
 * Returned as user types (lightweight, no coordinates)
 */
export interface MapboxSuggestion {
  name: string;
  mapbox_id: string;
  place_formatted: string;
  feature_type: "place" | "address" | "poi";
  context?: MapboxContext;
  distance?: number;
}

/**
 * Coordinate info with latitude/longitude
 */
export interface MapboxCoordinateInfo {
  longitude: number;
  latitude: number;
}

/**
 * Coordinates as [longitude, latitude] tuple
 */
export type LatLng = [number, number];

/**
 * Full place detail returned after retrieving a suggestion
 * Contains everything needed to display on map and card
 */
export interface PlaceDetail {
  name: string;
  fullAddress: string;
  placeFormatted: string;
  coordinates: MapboxCoordinateInfo;
  featureType: "place" | "address" | "poi" | string;
  region?: string;
  postcode?: string;
}
