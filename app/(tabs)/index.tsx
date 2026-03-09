import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import Mapbox, { MapView, Camera, UserLocation } from "@rnmapbox/maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Set Mapbox access token
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAP_BOX_API || "");

import { SearchBar } from "@/components/search-bar";
import { StopsCarousel } from "@/components/carousels/stops-carousel";
import { StopsModal } from "@/components/modals/stops-modal";
import { SearchWindowModal } from "@/components/modals/SearchWindowModal";
import { useUserLocation } from "@/hooks/useUserLocation";
// Using mock data while the API is down

export default function HomeScreen() {
  // Mock stops data used while the API is down
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

  // Treat as not loading when using mock data
  const loading = false;

  const insets = useSafeAreaInsets();
  const [isStopsOpen, setIsStopsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // Get user location
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useUserLocation();

  // Use the mock stops directly
  const stops = MOCK_STOPS;

  // Use user location or default to Melbourne
  const mapCenter = location
    ? [location.longitude, location.latitude]
    : [144.9645832, -37.8081607];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          styleURL="mapbox://styles/mapbox/streets-v11"
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Camera
            zoomLevel={14}
            centerCoordinate={mapCenter}
            animationMode="flyTo"
            animationDuration={1000}
          />
          <UserLocation
            visible={true}
            showUserHeading={false}
            androidRenderMode="gps"
          />
        </MapView>
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: Math.max(insets.top, 12),
          }}
        >
          <SearchBar
            onPress={() => setIsSearchOpen(true)}
            onIconPress={() => setIsSearchOpen(true)}
          />
        </View>
        {!isStopsOpen && (
          <View
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: Math.max(insets.top + 76, 90),
            }}
          >
            <View style={{ position: "relative" }}>
              {loading ? (
                <View
                  style={{
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
                  }}
                >
                  <ActivityIndicator size="large" color="#111827" />
                </View>
              ) : (
                <StopsCarousel stops={stops} />
              )}
              <Pressable
                accessibilityLabel="Add stop"
                onPress={() => setIsStopsOpen(true)}
                style={{
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
                }}
              >
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        )}
        <StopsModal
          stops={stops}
          visible={isStopsOpen}
          onClose={() => setIsStopsOpen(false)}
          topOffset={Math.max(insets.top + 76, 90)}
          bottomOffset={insets.bottom}
        />
        <SearchWindowModal
          visible={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          nearbyStops={stops}
        />
      </View>
    </SafeAreaView>
  );
}
