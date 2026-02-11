import { View } from "react-native";
import MapView from "react-native-maps";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SearchBar } from "@/components/search-bar";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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
      </View>
    </SafeAreaView>
  );
}
