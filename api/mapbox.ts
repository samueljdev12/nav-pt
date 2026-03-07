import axios, { AxiosInstance } from "axios";
import { MapboxSuggestion } from "@/types/mapbox";

const MAPBOX_PUBLIC_KEY = process.env.EXPO_PUBLIC_MAP_BOX_API;
const MAPBOX_BASE_URL = "https://api.mapbox.com";

if (!MAPBOX_PUBLIC_KEY) {
  console.warn("⚠️ EXPO_PUBLIC_MAPBOX_API is not set in .env");
}

interface MapboxRequest {
  query: string;
  proximity?: [number, number];
  limit: number;
  country: string;
  types: string;
  language: string;
}

class MapboxService {
  private static instance: MapboxService;
  private client: AxiosInstance;
  private sessionToken: string;
  private apiKey: string;
  private baseUrl: string;

  // Builder state
  private query: string = "";
  private proximity?: [number, number];
  private limit: number = 8;
  private country: string = "AU";
  private types: string = "place,address,poi";
  private language: string = "en";
  private selectedSuggestion: MapboxSuggestion | null = null;

  // Error state
  public error: Error | null = null;

  private constructor() {
    this.apiKey = MAPBOX_PUBLIC_KEY || "";
    this.sessionToken = this.generateSessionToken();
    this.baseUrl = MAPBOX_BASE_URL;
    this.client = axios.create({
      timeout: 10000,
    });
  }

  public static getInstance(): MapboxService {
    if (!MapboxService.instance) {
      MapboxService.instance = new MapboxService();
    }
    return MapboxService.instance;
  }

  public setBaseUrl(url: string): this {
    this.baseUrl = url;
    return this;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Generate a new session token
   */
  private generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public setQuery(q: string): this {
    this.query = q;
    return this;
  }

  public setProximity(lng: number, lat: number): this {
    this.proximity = [lng, lat];
    return this;
  }

  public setLimit(limit: number): this {
    this.limit = Math.min(Math.max(limit, 1), 10);
    return this;
  }

  public setCountry(country: string): this {
    this.country = country;
    return this;
  }

  public setTypes(types: string): this {
    this.types = types;
    return this;
  }

  public setLanguage(language: string): this {
    this.language = language;
    return this;
  }

  private buildSearchRequest(): MapboxRequest {
    return {
      query: this.query,
      proximity: this.proximity,
      limit: this.limit,
      country: this.country,
      types: this.types,
      language: this.language,
    };
  }

  public reset(): this {
    this.query = "";
    this.proximity = undefined;
    this.limit = 8;
    this.country = "AU";
    this.types = "place,address,poi";
    this.language = "en";
    this.selectedSuggestion = null;
    return this;
  }

  public setSuggestion(suggestion: MapboxSuggestion): this {
    this.selectedSuggestion = suggestion;
    return this;
  }

  public getSelectedSuggestion(): MapboxSuggestion | null {
    if (this.selectedSuggestion) {
      console.log("📍 Selected Suggestion:", {
        name: this.selectedSuggestion.name,
        mapbox_id: this.selectedSuggestion.mapbox_id,
        place_formatted: this.selectedSuggestion.place_formatted,
        context: this.selectedSuggestion.context,
      });
    }
    return this.selectedSuggestion;
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  public async suggest(): Promise<MapboxSuggestion[]> {
    try {
      const request = this.buildSearchRequest();

      if (!request.query.trim()) {
        return [];
      }

      if (!this.apiKey) {
        console.error("❌ Mapbox API key not configured");
        return [];
      }

      const params: Record<string, any> = {
        q: request.query,
        access_token: this.apiKey,
        session_token: this.sessionToken,
        country: request.country,
        limit: request.limit,
        types: request.types,
        language: request.language,
      };

      if (request.proximity) {
        params.proximity = `${request.proximity[0]},${request.proximity[1]}`;
      }

      const url = this.buildUrl("/search/searchbox/v1/suggest");
      const response = await this.client.get<any>(url, { params });

      return response.data.suggestions || [];
    } catch (error) {
      this.error = error instanceof Error ? error : new Error(String(error));
      console.error("❌ Mapbox suggest error:", error);
      return [];
    }
  }

  public async retrieve(mapboxId: string): Promise<any> {
    try {
      if (!mapboxId) {
        console.error("❌ mapbox_id is required");
        return null;
      }

      if (!this.apiKey) {
        console.error("❌ Mapbox API key not configured");
        return null;
      }

      const params: Record<string, any> = {
        access_token: this.apiKey,
        session_token: this.sessionToken,
      };

      const url = this.buildUrl(`/search/searchbox/v1/retrieve/${mapboxId}`);
      const response = await this.client.get<any>(url, { params });

      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        console.log("📍 Retrieved Place Details:", {
          type: feature.type,
          geometry: feature.geometry,
          properties: feature.properties,
          coordinates: feature.geometry.coordinates,
        });
      }

      return response.data;
    } catch (error) {
      this.error = error instanceof Error ? error : new Error(String(error));
      console.error("❌ Mapbox retrieve error:", error);
      return null;
    }
  }
}

export const mapboxService = MapboxService.getInstance();
export default mapboxService;
