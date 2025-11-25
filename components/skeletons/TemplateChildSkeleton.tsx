import React from "react";
import { View } from "react-native";
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

export const TemplateChildSkeleton = ({ index }: { index: number }) => {
  const { isDark } = useTheme();

  // Shared value for pulsing animation
  const pulse = useSharedValue(0);

  // Start pulsing
  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  // Animated background for card
  const animatedCardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      isDark
        ? ["#374151", "#4b5563"] // dark mode: gray-700 -> gray-600
        : ["rgba(209,213,219,0.15)", "rgba(209,213,219,0.3)"] // light mode shimmer
    ),
  }));

  // Animated style for smaller blocks inside card
  const blockStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      isDark ? ["#4b5563", "#6b7280"] : ["#d1d5db", "#e5e7eb"]
    ),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={animatedCardStyle}
      className="rounded-2xl p-5 mb-4 mx-4 overflow-hidden"
    >
      {/* Header row with icon */}
      <View className="flex-row items-center mb-4">
        <Animated.View
          className="w-14 h-14 rounded-xl"
          style={blockStyle}
        />
        <View className="flex-1 ml-4">
          <Animated.View
            className="h-4 w-28 rounded-md mb-2"
            style={blockStyle}
          />
          <Animated.View
            className="h-3 w-20 rounded-md"
            style={blockStyle}
          />
        </View>
      </View>

      {/* Template and child buttons row */}
      <View className="flex-row gap-3">
        <Animated.View
          className="flex-1 h-10 rounded-lg"
          style={blockStyle}
        />
        <Animated.View
          className="flex-1 h-10 rounded-lg"
          style={blockStyle}
        />
      </View>
    </Animated.View>
  );
};
