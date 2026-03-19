import React, { useEffect } from "react";
import { StyleSheet, TextInput, View, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { suggest } from "@/api/mapbox-search";
import { useUserLocation } from "@/hooks/useUserLocation";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSuggestionsChange?: (suggestions: any) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  onSuggestionsChange,
  placeholder = "Search address or stop...",
}: SearchInputProps) {
  const { location } = useUserLocation();

  useEffect(() => {
    if (value.trim().length > 2) {
      const timer = setTimeout(async () => {
        const proximity = location
          ? { longitude: location.longitude, latitude: location.latitude }
          : undefined;

        const suggestions = await suggest(value, proximity);

        if (onSuggestionsChange) {
          onSuggestionsChange(suggestions);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      if (onSuggestionsChange) {
        onSuggestionsChange([]);
      }
    }
  }, [value, onSuggestionsChange, location]);

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="search"
        size={20}
        color="#6B7280"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        cursorColor="#111827"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          style={styles.clearBtn}
          hitSlop={8}
        >
          <MaterialIcons name="close" size={20} color="#6B7280" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  clearBtn: {
    padding: 4,
  },
});
