import LogoutButton from "@/components/LogoutButton";
import { useTheme } from "@/context/ThemeContext";
import { getTheme } from "@/theme/theme";
import { Href, Link } from "expo-router";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);

  // Auto-fit card size based on width
  const cardSize =
    width >= 900
      ? "22%"
      : width >= 650
      ? "30%"
      : "47%";

  const menuItems: {
    title: string;
    description: string;
    href: Href;
    icon: string;
    color: string;
  }[] = [
    { title: "Children", description: "Manage profiles", href: "/child/ChildrenManager", icon: "👶", color: "#10b981" },
    { title: "Templates", description: "Task templates", href: "/taskTemplate/TaskTemplatesManager", icon: "📋", color: "#6366f1" },
    { title: "Assignments", description: "Assign tasks", href: "/templateChild/TemplateChildManager", icon: "🔗", color: "#8b5cf6" },
    { title: "Tasks", description: "All tasks", href: "/taskInstance/TaskInstancesManager", icon: "✅", color: "#f59e0b" },
    { title: "Overview", description: "Tasks by child", href: "/TaskInstanceByChildren/TaskInstanceByChildrenScreen", icon: "👨‍👩‍👧‍👦", color: "#ec4899" },
  ];

  return (
    <ScrollView className={`${theme.bgColor} flex-1`}>
      
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center">
        <View>
          <Text className={`text-3xl font-extrabold ${theme.headerTextColor}`}>
            Task Manager
          </Text>
          <Text className={`text-base mt-1 ${theme.subTextColor}`}>
            Manage your family’s tasks efficiently
          </Text>
        </View>

        {/* Theme Toggle */}
        <Pressable
          onPress={toggleTheme}
          className={`rounded-full items-center justify-center ${theme.buttonBgColor}`}
          style={{
            width: 48,
            height: 48,
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 22 }}>{isDark ? "☀️" : "🌙"}</Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View className="px-5 pb-10">
        <View className="flex-row flex-wrap justify-between gap-y-5">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href} asChild>
              <Pressable
                className="active:opacity-90"
                style={{
                  width: cardSize,
                  minWidth: 135,
                }}
              >
                <View
                  className={`${theme.cardBgColor} rounded-3xl border ${theme.cardBorderColor} p-6`}
                  style={{
                    aspectRatio: 1,
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                  }}
                >
                  {/* Icon Container */}
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{
                      backgroundColor: `${item.color}22`,
                    }}
                  >
                    <Text style={{ fontSize: 34 }}>{item.icon}</Text>
                  </View>

                  {/* Title */}
                  <Text className={`text-xl font-semibold mt-4 ${theme.cardNameColor}`}>
                    {item.title}
                  </Text>

                  {/* Description */}
                  <Text className={`text-sm mt-1 ${theme.subTextColor}`}>
                    {item.description}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>

        {/* Logout */}
        <View className="mt-8 mb-6">
          <LogoutButton />
        </View>
      </View>
    </ScrollView>
  );
}
