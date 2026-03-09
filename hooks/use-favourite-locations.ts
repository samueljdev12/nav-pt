import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/storage';
import { FavouriteLocation } from '@/types/favourites';

const FAVOURITES_KEY = 'favourite.locations';

export function useFavouriteLocations() {
  const [favourites, setFavourites] = useState<FavouriteLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favourites from storage on mount
  useEffect(() => {
    const loadFavourites = async () => {
      try {
        setIsLoading(true);
        const stored = await storage.getArray(FAVOURITES_KEY);
        setFavourites(stored || []);
      } catch (error) {
        console.error('Failed to load favourites:', error);
        setFavourites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavourites();
  }, []);

  // Save favourites to storage whenever they change
  const saveFavourites = useCallback(async (items: FavouriteLocation[]) => {
    try {
      await storage.setArray(FAVOURITES_KEY, items);
      setFavourites(items);
    } catch (error) {
      console.error('Failed to save favourites:', error);
    }
  }, []);

  const addFavourite = useCallback(
    (location: FavouriteLocation): void => {
      if (!isFavourite(location.id)) {
        const updated = [...favourites, location];
        saveFavourites(updated);
      }
    },
    [favourites, saveFavourites]
  );

  const removeFavourite = useCallback(
    (id: string): void => {
      const updated = favourites.filter((fav) => fav.id !== id);
      saveFavourites(updated);
    },
    [favourites, saveFavourites]
  );

  const toggleFavourite = useCallback(
    (location: FavouriteLocation): void => {
      if (isFavourite(location.id)) {
        removeFavourite(location.id);
      } else {
        addFavourite(location);
      }
    },
    [isFavourite, addFavourite, removeFavourite]
  );

  const isFavourite = useCallback(
    (id: string): boolean => favourites.some((fav) => fav.id === id),
    [favourites]
  );

  const clearFavourites = useCallback((): void => {
    saveFavourites([]);
  }, [saveFavourites]);

  const filterUnfavourited = useCallback(
    <T extends { id: string }>(items: T[]): T[] =>
      items.filter((item) => !isFavourite(item.id)),
    [isFavourite]
  );

  return {
    /** All saved favourite locations, always an array (never undefined). */
    favourites,
    /** True if loading favourites from storage. */
    isLoading,
    /** True if the location with the given id is saved as a favourite. */
    isFavourite,
    /** Add a location to favourites. No-op if already saved. */
    addFavourite,
    /** Remove a location from favourites by id. */
    removeFavourite,
    /** Add if not saved, remove if already saved. */
    toggleFavourite,
    /** Remove all favourites. */
    clearFavourites,
    /** Filter an array of items down to only those not already favourited. */
    filterUnfavourited,
  };
}
