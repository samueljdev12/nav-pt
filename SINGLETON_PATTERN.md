# Singleton Pattern Implementation

## Overview

The Mapbox API has been refactored to use the **Singleton Pattern**. This ensures only one instance of `MapboxService` exists throughout the app's lifetime.

## What Changed

### Before (Messy Global State)
```tsx
// Global variables scattered around
let sessionToken = generateSessionToken();
const mapboxClient = axios.create({...});

export async function suggestMapboxPlaces(query: string) {
  // Uses global sessionToken
}

export function resetSessionToken() {
  sessionToken = generateSessionToken(); // Direct mutation
}
```

**Problems:**
- Global state (hard to track)
- Multiple instances could theoretically be created
- No centralized lifecycle management
- Testing is difficult

### After (Singleton)
```tsx
class MapboxService {
  private static instance: MapboxService;
  private sessionToken: string;
  private client: AxiosInstance;
  
  private constructor() { /* initialization */ }
  
  static getInstance(): MapboxService {
    if (!MapboxService.instance) {
      MapboxService.instance = new MapboxService();
    }
    return MapboxService.instance;
  }
}

export const mapboxService = MapboxService.getInstance();
```

**Benefits:**
- ✅ Only one instance exists
- ✅ Controlled initialization
- ✅ Easy to reset/manage state
- ✅ Testable (can mock)
- ✅ Thread-safe

---

## How to Use

### Option 1: Use the Singleton Directly (Recommended)
```tsx
import { mapboxService } from "@/api/mapbox";

// In your component:
const suggestions = await mapboxService.suggest(query);
const details = await mapboxService.retrieve(mapboxId);

// Reset session when starting a new search
mapboxService.resetSessionToken();
```

### Option 2: Use Legacy Functions (Backward Compatible)
```tsx
import { suggestMapboxPlaces, retrieveMapboxPlace } from "@/api/mapbox";

// These are wrappers around the singleton
const suggestions = await suggestMapboxPlaces(query);
const details = await retrieveMapboxPlace(mapboxId);
```

---

## API Reference

### `MapboxService.getInstance(): MapboxService`
Returns the singleton instance. Creates it on first call.

```tsx
const service = MapboxService.getInstance();
// or
import { mapboxService } from "@/api/mapbox";
```

### `suggest(query: string, proximity?: [number, number]): Promise<MapboxSuggestion[]>`
Get autocomplete suggestions as user types.

```tsx
const suggestions = await mapboxService.suggest("Flinders St");
```

### `retrieve(mapboxId: string): Promise<MapboxRetrieveFeature | null>`
Get full details for a suggestion (includes coordinates).

```tsx
const details = await mapboxService.retrieve(suggestion.mapbox_id);
// Returns: { geometry: { coordinates: [lng, lat] }, properties: {...} }
```

### `resetSessionToken(): void`
Reset the session token (call when starting a new search session).

```tsx
mapboxService.resetSessionToken();
```

### `getSessionToken(): string`
Get the current session token.

```tsx
const token = mapboxService.getSessionToken();
```

### `isConfigured(): boolean`
Check if API key is configured.

```tsx
if (mapboxService.isConfigured()) {
  // Safe to use
}
```

---

## Why Singleton for Mapbox?

1. **Shared Session Token**: Mapbox batches requests by session for billing. One instance ensures proper grouping.

2. **Single HTTP Client**: Reusing the same axios instance improves performance (connection pooling).

3. **Controlled Lifecycle**: Know exactly when initialization happens and when to reset state.

4. **Consistency**: No accidental multiple instances with different tokens.

5. **Testability**: Easy to mock `MapboxService` for unit tests.

---

## Example: Complete Search Flow

```tsx
import { mapboxService } from "@/api/mapbox";

export function SearchWindowModal({ visible, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      // Uses singleton session token
      const results = await mapboxService.suggest(query);
      setSuggestions(results);
    }
  };

  const handleSelectSuggestion = async (suggestion: MapboxSuggestion) => {
    // Get full details including coordinates
    const details = await mapboxService.retrieve(suggestion.mapbox_id);
    
    if (details) {
      console.log("Selected place:", {
        name: details.properties.name,
        coordinates: details.geometry.coordinates,
      });
      // Update map, show details, etc.
    }
  };

  const handleNewSearch = () => {
    // Reset session when user starts fresh search
    mapboxService.resetSessionToken();
    setSearchQuery("");
    setSuggestions([]);
  };

  // ...
}
```

---

## Testing

Because `mapboxService` is a singleton, you can mock it in tests:

```tsx
// In your test file
import { mapboxService } from "@/api/mapbox";

jest.mock("@/api/mapbox", () => ({
  mapboxService: {
    suggest: jest.fn(() => Promise.resolve([
      { mapbox_id: "1", name: "Test Place", place_formatted: "Test Place, AU" }
    ])),
    retrieve: jest.fn(() => Promise.resolve({
      geometry: { coordinates: [144.9, -37.8] },
      properties: { name: "Test Place" }
    })),
    resetSessionToken: jest.fn(),
  },
}));

// Now test your component
```

---

## Migration Notes

- ✅ Existing code using `suggestMapboxPlaces()` and `retrieveMapboxPlace()` still works
- ✅ No breaking changes
- ✅ Gradually migrate to `mapboxService` as you refactor components
- ✅ No need to worry about multiple instances

---

## Future Improvements

1. **Add loading states**: Track when requests are in flight
2. **Add error handling**: Expose error states to components
3. **Add caching**: Reuse results for identical queries
4. **Add rate limiting**: Prevent too many requests
5. **Switch providers**: Replace Mapbox with another provider using same interface
