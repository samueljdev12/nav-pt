import { useMMKVObject } from "react-native-mmkv";
import { useCallback, useMemo } from "react";
import { storage } from "@/storage";
import { FavouriteStop } from "@/types/favourites";

const FAVOURITES_KEY = "favourite.stops";

export function useFavourites() {
  const [favourites, setFavourites] = useMMKVObject<FavouriteStop[]>(
    FAVOURITES_KEY,
    storage,
  );

  const all = useMemo(() => favourites ?? [], [favourites]);

  const isFavourite = useCallback(
    (id: string): boolean => all.some((s) => s.id === id),
    [all],
  );

  const addFavourite = useCallback(
    (stop: FavouriteStop): void => {
      if (!isFavourite(stop.id)) {
        setFavourites([...all, stop]);
      }
    },
    [all, isFavourite, setFavourites],
  );

  const removeFavourite = useCallback(
    (id: string): void => {
      setFavourites(all.filter((s) => s.id !== id));
    },
    [all, setFavourites],
  );

  const toggleFavourite = useCallback(
    (stop: FavouriteStop): void => {
      if (isFavourite(stop.id)) {
        removeFavourite(stop.id);
      } else {
        addFavourite(stop);
      }
    },
    [isFavourite, addFavourite, removeFavourite],
  );

  const clearFavourites = useCallback((): void => {
    setFavourites([]);
  }, [setFavourites]);

  /**
   * Given any array of items that have an `id` field, returns only the items
   * whose id is NOT already saved as a favourite.
   * Generic so it works with StopItem, FavouriteStop, or any id-bearing type.
   */
  const filterUnfavourited = useCallback(
    <T extends { id: string }>(items: T[]): T[] =>
      items.filter((item) => !isFavourite(item.id)),
    [isFavourite],
  );

  return {
    /** All saved favourite stops, always an array (never undefined). */
    favourites: all,
    /** True if the stop with the given id is saved as a favourite. */
    isFavourite,
    /** Add a stop to favourites. No-op if already saved. */
    addFavourite,
    /** Remove a stop from favourites by id. */
    removeFavourite,
    /** Add if not saved, remove if already saved. */
    toggleFavourite,
    /** Remove all favourites. */
    clearFavourites,
    /** Filter an array of stops down to only those not already favourited. */
    filterUnfavourited,
  };
}
