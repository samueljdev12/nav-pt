# MapboxService Builder Pattern Usage

## Overview

`MapboxService` now uses the Builder Pattern internally. All setter methods are chainable and return `this`, allowing fluent API configuration before executing requests.

## Basic Usage

### Simple Suggest
```tsx
import { mapboxService } from "@/api/mapbox";

const results = await mapboxService
  .setQuery("coffee shops")
  .suggest();
```

### With Proximity
```tsx
const results = await mapboxService
  .setQuery("restaurants")
  .setProximity(144.9645, -37.8081)
  .suggest();
```

### With Limit
```tsx
const results = await mapboxService
  .setQuery("parks")
  .setLimit(5)
  .suggest();
```

### Full Configuration
```tsx
const results = await mapboxService
  .setQuery("museums")
  .setProximity(144.9645, -37.8081)
  .setLimit(10)
  .setCountry("AU")
  .suggest();
```

## Retrieve Details

```tsx
const details = await mapboxService.retrieve(mapboxId);

if (details) {
  const [lng, lat] = details.geometry.coordinates;
  console.log("Name:", details.properties.name);
  console.log("Address:", details.properties.full_address);
}
```

## Builder Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `setQuery(string)` | Set search term | `this` |
| `setProximity(lng, lat)` | Bias to location | `this` |
| `setLimit(number)` | Max results (1-10) | `this` |
| `setCountry(string)` | Country filter | `this` |
| `setTypes(string)` | Feature types | `this` |
| `setLanguage(string)` | Response language | `this` |
| `suggest()` | Execute suggest | `Promise<MapboxSuggestion[]>` |
| `retrieve(id)` | Get full details | `Promise<MapboxRetrieveFeature \| null>` |
| `reset()` | Clear all config | `this` |
| `getConfig()` | Get current config | `MapboxRequest` |

## React Component Example

```tsx
import { useState } from "react";
import { mapboxService, MapboxSuggestion } from "@/api/mapbox";

export function SearchComponent() {
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);

  const handleSearch = async (query: string) => {
    const results = await mapboxService
      .setQuery(query)
      .setProximity(144.9645, -37.8081)
      .setLimit(8)
      .suggest();
    setSuggestions(results);
  };

  const handleSelect = async (mapboxId: string) => {
    const details = await mapboxService.retrieve(mapboxId);
    if (details) {
      console.log("Selected:", details.properties.name);
    }
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <ul>
        {suggestions.map((s) => (
          <li key={s.mapbox_id} onClick={() => handleSelect(s.mapbox_id)}>
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Reusing Configuration

```tsx
// Configure base settings
mapboxService
  .setProximity(144.9645, -37.8081)
  .setLimit(5);

// Execute multiple searches with same base config
const coffee = await mapboxService.setQuery("coffee").suggest();
const food = await mapboxService.setQuery("restaurants").suggest();

// Reset for new search
mapboxService.reset();
const newSearch = await mapboxService.setQuery("parks").suggest();
```

## Debugging

```tsx
// Inspect current configuration
const config = mapboxService.getConfig();
console.log(config);
// Output: { query: "search", proximity: [...], limit: 8, ... }
```

## Key Points

- ✅ All setters are chainable (return `this`)
- ✅ Optional parameters - set only what you need
- ✅ Defaults: limit=8, country=AU, types=place,address,poi
- ✅ Coordinates are [longitude, latitude]
- ✅ Call `reset()` to clear state
- ✅ Singleton instance shared throughout app