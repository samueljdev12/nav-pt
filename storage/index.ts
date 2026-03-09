import { MMKVLoader } from 'react-native-mmkv-storage';

/**
 * Shared MMKV storage singleton.
 * Import this instance throughout the app — do NOT create new instances per component.
 * MMKV is an ultra-fast key-value storage using C++ and JSI.
 */
export const storage = new MMKVLoader().initialize();
