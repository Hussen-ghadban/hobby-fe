import LogoutButton from "@/components/LogoutButton";
import { useTheme } from "@/context/ThemeContext";
import { getTheme } from "@/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);
  const { width: screenWidth } = useWindowDimensions();

  // Calculate card width for flexible layout
  const padding = 48; // 24px on each side (px-6 = 6 * 4 = 24)
  const gap = 16;
  const cardsPerRow = 2; // Change this to 1, 2, or 3 for different layouts
  const cardWidth = (screenWidth - padding - gap * (cardsPerRow - 1)) / cardsPerRow;

  const menuItems = [
    {
      title: "My Kids",
      description: "Manage profiles",
      href: "/child/ChildrenManager",
      iconName: "face-man-profile" as const,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Task Library",
      description: "Create & edit tasks",
      href: "/taskTemplate/TaskTemplatesManager",
      iconName: "clipboard-text-outline" as const,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      title: "Task Groups",
      description: "Organize tasks",
      href: "/ChildBundle/ChildTaskBundleManager",
      iconName: "folder-multiple-outline" as const,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      title: "Assign Tasks",
      description: "Give tasks to kids",
      href: "/ChildBundleAssignment/ChildBundleAssignmentManager",
      iconName: "basket-outline" as const,
      color: "#f97316",
      bgColor: "rgba(249, 115, 22, 0.1)",
    },
    {
      title: "Progress",
      description: "Track completion",
      href: "/TaskInstanceByChildren/TaskInstanceByChildrenScreen",
      iconName: "chart-timeline-variant" as const,
      color: "#ec4899",
      bgColor: "rgba(236, 72, 153, 0.1)",
    },
  ] as const;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView className={`flex-1 ${theme.bgColor}`}>
      
      {/* Header (fixed) */}
      <View className="px-6 pt-2 flex-row justify-end items-center">
        <Pressable
          onPress={toggleTheme}
          className={`h-10 w-10 rounded-full items-center justify-center border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <MaterialCommunityIcons
            name={isDark ? "weather-sunny" : "weather-night"}
            size={20}
            color={isDark ? "#fbbf24" : "#475569"}
          />
        </Pressable>
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <View className="px-6 mt-4">
          <Text
            className={`text-xs font-medium uppercase tracking-wider mb-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {currentDate}
          </Text>

          <Text className={`text-2xl font-bold ${theme.headerTextColor}`}>
            Hello, Parent
          </Text>

          <Text className={`text-sm mt-1 ${theme.subTextColor}`}>
            Manage your family&apos;s tasks
          </Text>
        </View>

        {/* Grid - Flexible Cards */}
        <View className="px-6 mt-4">
          <View
            className="flex-row flex-wrap"
            style={{ gap: 16 }}
          >
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href as Href} asChild>
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    width: cardWidth,
                  })}
                >
                  <View
                    className={`rounded-3xl p-4 justify-between ${
                      isDark ? "bg-slate-800" : "bg-white"
                    }`}
                    style={{
                      height: 140,
                      shadowColor: isDark ? "#000" : "#94a3b8",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isDark ? 0.3 : 0.1,
                      shadowRadius: 12,
                      elevation: 5,
                    }}
                  >
                    <View className="flex-row justify-between items-start">
                      <View
                        className="h-11 w-11 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <MaterialCommunityIcons
                          name={item.iconName}
                          size={22}
                          color={item.color}
                        />
                      </View>

                      <MaterialCommunityIcons
                        name="arrow-top-right"
                        size={18}
                        color={isDark ? "#64748b" : "#cbd5e1"}
                      />
                    </View>

                    <View>
                      <Text
                        className={`text-base font-bold mb-0.5 ${theme.cardNameColor}`}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 mt-6">
          <View
            className={`p-3 rounded-2xl ${
              isDark ? "bg-slate-800/50" : "bg-slate-100"
            }`}
          >
            <Text className={`text-center text-sm font-medium mb-3 ${theme.subTextColor}`}>
              Account Management
            </Text>
            <LogoutButton />
          </View>

          <Text className="text-center text-xs text-slate-400 mt-3">
            Family Task Manager v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}