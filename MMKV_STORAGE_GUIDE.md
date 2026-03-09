# MMKV Storage & Favourite Locations Guide

## Overview

This app uses **MMKV Storage** for fast, persistent data storage. It's perfect for storing favourite locations that persist even after the app is closed and reopened.

**Why MMKV?**
- ⚡ **Ultra-fast**: 0.0002s read/write speed (written in C++)
- 💾 **Persistent**: Data survives app restarts
- 📱 **Lightweight**: Only ~50KB
- 🔒 **Secure**: Can be encrypted
- ✨ **JSI-based**: No bridge overhead

## File Structure

```
storage/
├── index.ts              # MMKV storage singleton instance

hooks/
├── use-favourite-locations.ts    # Hook for managing favourites

types/
├── favourites.ts         # TypeScript types for favourite locations
```

## How It Works

### 1. Storage Instance (`storage/index.ts`)

```typescript
import { MMKVLoader } from 'react-native-mmkv-storage';

export const storage = new MMKVLoader().initialize();
```

**What it does:**
- Creates a single shared storage instance
- Available throughout the app
- Data stored in a fast C++ backed database

**Important:** Always import from `@/storage`, never create new instances!

### 2. Favourite Locations Hook (`hooks/use-favourite-locations.ts`)

#### How to use in a component:

```typescript
import { useFavouriteLocations } from '@/hooks/use-favourite-locations';

export function MyComponent() {
  const {
    favourites,        // Array of saved favourite locations
    isLoading,         // Loading state when fetching from storage
    addFavourite,      // Function to add a location
    removeFavourite,   // Function to remove by id
    isFavourite,       // Check if id is saved
    toggleFavourite,   // Add/remove depending on current state
    clearFavourites,   // Remove all
    filterUnfavourited // Filter array to only non-favourited items
  } = useFavouriteLocations();

  // Use these functions in your UI
  const handleAddFav = () => {
    addFavourite({
      id: 'stop-123',
      title: 'Flinders St Station',
      subtitle: 'Flinders St, Melbourne',
      latitude: -37.8183,
      longitude: 144.9671,
      color: '0EA5E9',
      textColor: 'FFFFFF'
    });
  };

  return (
    <View>
      <Text>{favourites.length} saved locations</Text>
      {/* Render your UI */}
    </View>
  );
}
```

#### API Reference

| Function | Description | Example |
|----------|-------------|---------|
| `addFavourite(location)` | Save a location | `addFavourite({id: '1', title: 'Home', ...})` |
| `removeFavourite(id)` | Remove by ID | `removeFavourite('1')` |
| `isFavourite(id)` | Check if saved | `if (isFavourite('1'))` |
| `toggleFavourite(location)` | Toggle save state | `toggleFavourite(location)` |
| `clearFavourites()` | Remove all | `clearFavourites()` |
| `filterUnfavourited(items)` | Filter non-saved | `filterUnfavourited(stops)` |

### 3. Data Structure (`types/favourites.ts`)

```typescript
interface FavouriteLocation {
  id: string;              // Unique identifier
  title: string;           // Display name (e.g., "Flinders St Station")
  subtitle: string;        // Address or location detail
  latitude: number;        // Location latitude
  longitude: number;       // Location longitude
  color?: string;          // Optional: hex color for marker
  textColor?: string;      // Optional: text color
  mode?: string;           // Optional: transit mode (TRAM, BUS, TRAIN)
}
```

## Real-World Example

Here's how you'd implement a favorite button in a stop card:

```typescript
import { useFavouriteLocations } from '@/hooks/use-favourite-locations';
import { FavouriteLocation } from '@/types/favourites';

export function StopCard({ stop }) {
  const { isFavourite, toggleFavourite } = useFavouriteLocations();

  const handleToggleFavourite = () => {
    const favLocation: FavouriteLocation = {
      id: stop.id,
      title: stop.title,
      subtitle: stop.subtitle,
      latitude: stop.latitude,
      longitude: stop.longitude,
      color: stop.color,
      textColor: stop.textColor,
      mode: stop.mode,
    };
    toggleFavourite(favLocation);
  };

  return (
    <View>
      <Text>{stop.title}</Text>
      <Pressable
        onPress={handleToggleFavourite}
        style={{
          backgroundColor: isFavourite(stop.id) ? '#FFD54F' : '#E5E7EB'
        }}
      >
        <Text>{isFavourite(stop.id) ? '★' : '☆'}</Text>
      </Pressable>
    </View>
  );
}
```

## Data Persistence

✅ **Automatic**: Changes are automatically saved to device storage
✅ **Survives app restart**: Close and reopen the app, data persists
✅ **Async safe**: All operations are async and handled internally

When you call:
```typescript
addFavourite(location)
```

The hook:
1. Updates local state instantly (UI responds immediately)
2. Saves to device storage in background
3. Data persists forever

## Performance Tips

1. **Load once per component**: The hook handles caching
2. **Don't create multiple instances**: Import from `@/storage` only
3. **Use `isFavourite()` for checking**: Optimized for fast lookups
4. **Filter before rendering**: Use `filterUnfavourited()` for lists

## Common Patterns

### Show only non-saved items:
```typescript
const { favourites, filterUnfavourited } = useFavouriteLocations();
const availableStops = filterUnfavourited(allStops);
```

### Display saved locations section:
```typescript
const { favourites, isLoading } = useFavouriteLocations();

if (isLoading) return <ActivityIndicator />;
if (favourites.length === 0) return <Text>No saved locations</Text>;

return <FlatList data={favourites} renderItem={...} />;
```

### Toggle with UI feedback:
```typescript
const { isFavourite, toggleFavourite } = useFavouriteLocations();

<Pressable
  onPress={() => toggleFavourite(location)}
  style={{
    opacity: isFavourite(location.id) ? 1 : 0.5
  }}
>
  <Icon name={isFavourite(location.id) ? 'star-filled' : 'star'} />
</Pressable>
```

## Debugging

### View stored data:
Use React DevTools or Flipper to inspect the `favourite.locations` key in storage.

### Clear all favourites:
```typescript
const { clearFavourites } = useFavouriteLocations();
clearFavourites();
```

### Check storage directly:
```typescript
import { storage } from '@/storage';

const faves = await storage.getArray('favourite.locations');
console.log('Stored favourites:', faves);
```

## Advanced: Multiple Storage Instances

If you need separate storage for different features:

```typescript
// In storage/index.ts
export const storage = new MMKVLoader().initialize();
export const settingsStorage = new MMKVLoader()
  .withInstanceID('settings')
  .initialize();
```

Then use the appropriate instance in different hooks.

---

**Need help?** Check the [MMKV Storage documentation](https://rnmmkv.vercel.app)