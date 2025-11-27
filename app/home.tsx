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

// The padding used around the screen content (px-6 -> 6*4=24, so total 48)
const HORIZONTAL_PADDING = 48; 
// The gap between cards (gap-4 -> 4*4=16)
const CARD_GAP = 16;
// Number of cards to show per row
const CARDS_PER_ROW = 2; 

export default function HomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);
  const { width: screenWidth } = useWindowDimensions();

  // 1. Calculate the card width for a responsive 2-column layout
  // (screenWidth - total_padding - total_gap) / CARDS_PER_ROW
  const availableWidth = screenWidth - HORIZONTAL_PADDING - (CARD_GAP * (CARDS_PER_ROW - 1));
  const cardWidth = availableWidth / CARDS_PER_ROW;
  
  // Guard against very small screens if needed, though flex-wrap handles this well
  const finalCardWidth = Math.max(cardWidth, 150); // Ensure a minimum width

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
    {
      title: "Settings",
      description: "App configuration",
      href: "/settings",
      iconName: "cog-outline" as const,
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
    },
    
  ] as const;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView className={`flex-1 ${theme.bgColor}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero & Header */}
        <View className="px-6 pt-2 mb-4 flex-row justify-between items-start">
          <View className="flex-shrink max-w-[70%]">
            <Text
              className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {currentDate}
            </Text>

            <Text className={`text-3xl font-bold ${theme.headerTextColor}`}>
              Hello, Parent
            </Text>

            <Text className={`text-sm mt-1 ${theme.subTextColor}`}>
              Manage your family&apos;s tasks
            </Text>
          </View>
          
          {/* Theme Toggle Button */}
          <Pressable
            onPress={toggleTheme}
            className={`h-11 w-11 rounded-full items-center justify-center border-2 ${
              isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-100"
            }`}
          >
            <MaterialCommunityIcons
              name={isDark ? "weather-sunny" : "weather-night"}
              size={22}
              color={isDark ? "#facc15" : "#475569"}
            />
          </Pressable>
        </View>

        {/* Grid - Responsive Cards */}
        <View className="px-6 mt-2">
          <View className="flex-row flex-wrap justify-between gap-4">
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href as Href} asChild>
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    width: finalCardWidth,
                  })}
                >
                  <View
                    className={`rounded-xl p-4 border-2 ${
                      isDark 
                        ? "bg-slate-800 border-slate-700" 
                        : "bg-white border-gray-100"
                    }`}
                    style={{
                      height: 140,
                      width: finalCardWidth,
                      shadowColor: isDark ? "#000" : "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isDark ? 0.4 : 0.05,
                      shadowRadius: 10,
                      elevation: 5,
                    }}
                  >
                    <View className="flex-row justify-between items-start">
                      <View
                        className="h-11 w-11 rounded-xl items-center justify-center"
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
                        color={isDark ? "#64748b" : "#94a3b8"}
                      />
                    </View>

                    <View>
                      <Text
                        className={`text-lg font-extrabold mb-0.5 ${theme.cardNameColor}`}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        className={`text-sm ${
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
            {/* Filler view for proper alignment with odd number of items */}
            {menuItems.length % CARDS_PER_ROW !== 0 && (
              <View style={{ width: finalCardWidth, height: 0 }} />
            )}
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 mt-8">
          <View
            className={`p-4 rounded-xl border-2 ${ 
              isDark 
                ? "bg-slate-800/50 border-slate-700" 
                : "bg-slate-100 border-gray-200"
            }`}
          >
            <Text className={`text-center text-base font-semibold mb-3 ${theme.subTextColor}`}>
              Account Management
            </Text>
            <LogoutButton />
          </View>

          <Text className="text-center text-xs text-slate-400 mt-4">
            Family Task Manager v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}