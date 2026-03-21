import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  PointAnnotation,
} from "@rnmapbox/maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SearchBar } from "@/components/search-bar";
import { StopsCarousel } from "@/components/carousels/stops-carousel";
import { StopsModal } from "@/components/modals/stops-modal";
import { SearchWindowModal } from "@/components/modals/SearchWindowModal";
import { PlaceDetailCard } from "@/components/cards/place-detail-card";
import { useUserLocation } from "@/hooks/useUserLocation";
import { PlaceDetail } from "@/types/mapbox";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAP_BOX_API || "");

const MELBOURNE_CENTER: [number, number] = [144.9645832, -37.8081607];
const DEFAULT_ZOOM = 14;
const PLACE_ZOOM = 16;

export default function HomeScreen() {
  const MOCK_STOPS = [
    {
      id: "1001",
      title: "→ Route 86",
      subtitle: "Flinders St / Swanston St",
      minutes: 5,
      color: "0EA5E9",
      textColor: "FFFFFF",
      mode: "TRAM",
    },
    {
      id: "1002",
      title: "→ Route 246",
      subtitle: "Brunswick St / Johnston St",
      minutes: 12,
      color: "10B981",
      textColor: "FFFFFF",
      mode: "BUS",
    },
    {
      id: "1003",
      title: "→ Frankston",
      subtitle: "South Yarra Station",
      minutes: 3,
      color: "EF4444",
      textColor: "FFFFFF",
      mode: "TRAIN",
    },
  ];

  const loading = false;
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<Camera>(null);

  const [isStopsOpen, setIsStopsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetail | null>(null);

  const { location } = useUserLocation();

  const stops = MOCK_STOPS;

  const mapCenter = location
    ? [location.longitude, location.latitude]
    : MELBOURNE_CENTER;

  const handlePlaceSelect = (place: PlaceDetail) => {
    setSelectedPlace(place);
    setIsSearchOpen(false);
    setIsStopsOpen(false);

    cameraRef.current?.setCamera({
      centerCoordinate: [
        place.coordinates.longitude,
        place.coordinates.latitude,
      ],
      zoomLevel: PLACE_ZOOM,
      animationDuration: 1200,
      animationMode: "flyTo",
    });
  };

  const handleClosePlace = () => {
    setSelectedPlace(null);

    const center = location
      ? [location.longitude, location.latitude]
      : MELBOURNE_CENTER;

    cameraRef.current?.setCamera({
      centerCoordinate: center,
      zoomLevel: DEFAULT_ZOOM,
      animationDuration: 800,
      animationMode: "flyTo",
    });
  };

  const handleOpenSearch = () => {
    setSelectedPlace(null);
    setIsSearchOpen(true);
  };

  const showCarousel = !isStopsOpen && !selectedPlace;
  const showPlaceCard = selectedPlace !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v11"
          zoomEnabled
          scrollEnabled
          pitchEnabled={false}
          rotateEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Camera
            ref={cameraRef}
            zoomLevel={DEFAULT_ZOOM}
            centerCoordinate={mapCenter}
            animationMode="flyTo"
            animationDuration={1000}
          />

          <UserLocation visible androidRenderMode="gps" />

          {selectedPlace && (
            <PointAnnotation
              id="selected-place"
              coordinate={[
                selectedPlace.coordinates.longitude,
                selectedPlace.coordinates.latitude,
              ]}
            >
              <View style={styles.markerOuter}>
                <View style={styles.markerInner}>
                  <MaterialIcons name="place" size={20} color="#FFFFFF" />
                </View>
              </View>
            </PointAnnotation>
          )}
        </MapView>

        <View
          style={[styles.searchBarWrapper, { top: Math.max(insets.top, 12) }]}
        >
          <SearchBar
            onPress={handleOpenSearch}
            onIconPress={handleOpenSearch}
          />
        </View>

        {showCarousel && (
          <View
            style={[
              styles.carouselWrapper,
              { top: Math.max(insets.top + 76, 90) },
            ]}
          >
            <View style={styles.carouselInner}>
              {loading ? (
                <View style={styles.loadingCard}>
                  <ActivityIndicator size="large" color="#111827" />
                </View>
              ) : (
                <StopsCarousel stops={stops} />
              )}

              <Pressable
                accessibilityLabel="Add stop"
                onPress={() => setIsStopsOpen(true)}
                style={styles.addButton}
              >
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        )}

        {showPlaceCard && (
          <View
            style={[styles.placeCardWrapper, { bottom: insets.bottom + 100 }]}
          >
            <PlaceDetailCard
              place={selectedPlace}
              onClose={handleClosePlace}
              onFavouriteToggle={() => {}}
              onNavigate={() => {}}
            />
          </View>
        )}

        <StopsModal
          stops={stops}
          visible={isStopsOpen}
          onClose={() => setIsStopsOpen(false)}
          topOffset={Math.max(insets.top + 76, 90)}
          bottomOffset={insets.bottom + 80}
        />

        <SearchWindowModal
          visible={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onPlaceSelect={handlePlaceSelect}
          nearbyStops={stops}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBarWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  carouselWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  carouselInner: {
    position: "relative",
  },
  loadingCard: {
    height: 120,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  addButton: {
    position: "absolute",
    right: -8,
    bottom: -8,
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  placeCardWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  markerOuter: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#71BE46",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
