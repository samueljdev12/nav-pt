import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import MapView from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SearchBar } from "@/components/search-bar";
import { StopsCarousel } from "@/components/stops-carousel";
import { StopsModal } from "@/components/stops-modal";
import { useQuery } from "@apollo/client/react";
import { GET_NEARBY_STOPS } from "@/graphql/queries";
import { YourStopsCardData } from "@/types/graphql";

export default function HomeScreen() {
  const { loading, error, data } = useQuery<YourStopsCardData>(
    GET_NEARBY_STOPS,
    {
      variables: {
        // lat: -38.125755310058594,
        // lon: 145.3208465576172,
        lat: -37.8081607,
        lon: 144.9645832,
        radius: 5000, // Radius in meters
        first: 5, // Number of stops to fetch
      },
    },
  );

  if (error) {
    console.error("Error fetching nearby stops:", error);
  }

  console.log("Nearby stops data:", JSON.stringify(data, null, 2));

  const insets = useSafeAreaInsets();
  const [isStopsOpen, setIsStopsOpen] = React.useState(false);

  // Map query response to stops format
  const stops =
    data?.stopsByRadius.edges.map((edge, index) => ({
      id: edge.node.stop.gtfsId,
      title: `→ ${edge.node.stop.routes[0]?.longName.split(" - ").pop() || "Unknown Route"}`,
      subtitle: edge.node.stop.name,
      minutes: Math.floor(Math.random() * 600) + 1,
      color: edge.node.stop.routes[0]?.color,
      textColor: edge.node.stop.routes[0]?.textColor,
      mode: edge.node.stop.routes[0]?.mode,
    })) || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: Math.max(insets.top, 12),
          }}
        >
          <SearchBar />
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
      </View>
    </SafeAreaView>
  );
}
