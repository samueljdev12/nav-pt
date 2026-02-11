import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onIconPress?: () => void;
}

export function SearchBar({
  placeholder = "Where to next?",
  value,
  onChangeText,
  onPress,
  onIconPress,
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#5A5A5A"
          value={value}
          onChangeText={onChangeText}
          onPressIn={onPress}
          cursorColor="#1A1A1A"
        />
        <Pressable
          style={styles.iconButton}
          accessibilityLabel="Search"
          onPress={onIconPress ?? onPress}
        >
          <MaterialIcons name="search" size={18} color="#1A1A1A" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    backgroundColor: "#FFD54F",
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 38,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -14,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
