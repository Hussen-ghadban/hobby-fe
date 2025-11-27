import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

const STORAGE_KEY = "app:theme-preference";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setIsDark(saved === "dark");
        } else {
          // Use system preference
          setIsDark(systemScheme === "dark");
        }
      } catch {
        // Fallback to system preference
        setIsDark(systemScheme === "dark");
      }
      setMounted(true);
    };

    initializeTheme();
  }, []);

  // Apply dark class to document root on web
  useEffect(() => {
    if (!mounted || isDark === null) return;

    if (Platform.OS === "web" && typeof document !== "undefined") {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [isDark, mounted]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark ? "dark" : "light";
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
      setIsDark(!isDark);
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  };

  // Don't render children until theme is initialized
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark: isDark || false, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};