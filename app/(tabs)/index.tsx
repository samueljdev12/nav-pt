import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, View } from "react-native";
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

export default function HomeScreen() {
  const { loading, error, data } = useQuery(GET_NEARBY_STOPS, {
    variables: {
      lat: -38.125755310058594,
      lon: 145.3208465576172,
      radius: 5000, // Radius in meters
    },
  });

  if (data) {
    console.log("Nearby Stops:", JSON.stringify(data, null, 2));
  }

  if (error) {
    console.error("Error fetching nearby stops:", error);
  }

  const insets = useSafeAreaInsets();
  const [isStopsOpen, setIsStopsOpen] = React.useState(false);
  const stops = [
    {
      id: "1",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 391,
    },
    {
      id: "2",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 392,
    },
    {
      id: "3",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 393,
    },
    {
      id: "4",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 390,
    },
    {
      id: "5",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 493,
    },
    {
      id: "6",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 593,
    },
    {
      id: "7",
      title: "→ Lynbrook Station (via Cranbourne…)",
      subtitle: "Shopping on Clyde/Berwick-Cranbou…",
      minutes: 383,
    },
  ];

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
              <StopsCarousel stops={stops} />
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
