import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { IconSymbol } from "./ui/icon-symbol";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconName =
            route.name === "index"
              ? "house.fill"
              : route.name === "history"
                ? "clock.fill"
                : route.name === "notifications"
                  ? "bell.fill"
                  : "plus.circle.fill";

          return (
            <View key={route.key} style={styles.tabItemWrapper}>
              {isFocused && <View style={styles.activeCircle} />}
              <Pressable
                onPress={onPress}
                style={[
                  styles.tabItem,
                  isFocused && styles.activeTabItem,
                  isFocused && styles.activeIcon,
                ]}
              >
                <IconSymbol name={iconName as any} size={32} color="#FFD700" />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#71BE46",
    borderRadius: 50,
    paddingVertical: 1,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    zIndex: 10,
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 50,
    width: "100%",
  },
  activeTabItem: {
    backgroundColor: "transparent",
  },
  activeIcon: {
    zIndex: 10,
  },
  activeCircle: {
    position: "absolute",
    width: 50,
    height: 60,
    backgroundColor: "#3d7030",
    borderRadius: 25,
    top: -8,
    zIndex: 2,
  },
});
