import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="pb-4 pt-2">
        <Text className="text-3xl font-bold text-slate-900">Home</Text>
        <Text className="mt-2 text-base text-slate-600">
          NativeWind is working ✅
        </Text>
      </View>

      <View className="gap-4">
        <View className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Text className="text-lg font-semibold text-slate-900">Card A</Text>
          <Text className="mt-1 text-sm text-slate-600">
            Utility classes apply to React Native components.
          </Text>
        </View>
        <View className="rounded-2xl bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-white">Card B</Text>
          <Text className="mt-1 text-sm text-slate-300">
            Dark background with light text.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
