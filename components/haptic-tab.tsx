import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { StyleSheet, View } from "react-native";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <View
      style={[
        styles.container,
        props.accessibilityState?.selected && styles.activeContainer,
      ]}
    >
      <PlatformPressable
        {...props}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === "ios") {
            // Add a soft haptic feedback when pressing down on the tabs.
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeContainer: {
    backgroundColor: "#3d7030",
    borderRadius: 50,
    marginHorizontal: 6,
    marginVertical: 6,
  },
  button: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
