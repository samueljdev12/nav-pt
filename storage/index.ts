import { createMMKV } from "react-native-mmkv";

/**
 * Shared MMKV storage singleton.
 * Import this instance throughout the app — do NOT create new instances per component.
 */
export const storage = createMMKV();
