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

export const TaskTemplateSkeleton = ({ index }: { index: number }) => {
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

  // Animated style for skeleton elements
  const skeletonStyle = useAnimatedStyle(() => ({
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
      {/* Header row */}
      <View className="flex-row justify-between mb-4">
        {/* Left text block */}
        <View className="flex-1 mr-3">
          <Animated.View
            className="h-4 w-40 rounded-md mb-2"
            style={skeletonStyle}
          />
          <Animated.View
            className="h-3 w-28 rounded-md"
            style={skeletonStyle}
          />
        </View>

        {/* Priority badge */}
        <Animated.View
          className="w-20 h-6 rounded-full"
          style={skeletonStyle}
        />
      </View>

      {/* Tags row */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        <Animated.View
          className="h-6 w-20 rounded-lg"
          style={skeletonStyle}
        />
        <Animated.View
          className="h-6 w-24 rounded-lg"
          style={skeletonStyle}
        />
        <Animated.View
          className="h-6 w-16 rounded-lg"
          style={skeletonStyle}
        />
      </View>

      {/* Buttons row */}
      <View className="flex-row gap-3">
        <Animated.View
          className="flex-1 h-10 rounded-lg"
          style={skeletonStyle}
        />
        <Animated.View
          className="flex-1 h-10 rounded-lg"
          style={skeletonStyle}
        />
      </View>
    </Animated.View>
  );
};