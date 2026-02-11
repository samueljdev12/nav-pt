import { View } from "react-native";
import MapView from "react-native-maps";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SearchBar } from "@/components/search-bar";
import { StopsCarousel } from "@/components/stops-carousel";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: Math.max(insets.top + 76, 90),
          }}
        >
          <StopsCarousel stops={stops} />
        </View>
      </View>
    </SafeAreaView>
  );
}
