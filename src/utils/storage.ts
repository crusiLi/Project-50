import { Preferences } from '@capacitor/preferences';
import { isNativePlatform } from './capacitor';

// 统一的存储接口
export const setItem = async (key: string, value: string): Promise<void> => {
  if (isNativePlatform()) {
    // 移动端使用Capacitor Preferences
    await Preferences.set({ key, value });
  } else {
    // Web端使用localStorage
    localStorage.setItem(key, value);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  if (isNativePlatform()) {
    // 移动端使用Capacitor Preferences
    const { value } = await Preferences.get({ key });
    return value;
  } else {
    // Web端使用localStorage
    return localStorage.getItem(key);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  if (isNativePlatform()) {
    // 移动端使用Capacitor Preferences
    await Preferences.remove({ key });
  } else {
    // Web端使用localStorage
    localStorage.removeItem(key);
  }
};

export const clear = async (): Promise<void> => {
  if (isNativePlatform()) {
    // 移动端使用Capacitor Preferences
    await Preferences.clear();
  } else {
    // Web端使用localStorage
    localStorage.clear();
  }
}; 