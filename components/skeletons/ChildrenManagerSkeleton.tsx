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

export const ChildrenManagerSkeleton = ({ index }: { index: number }) => {
  // Shared value for pulsing animation
  const pulse = useSharedValue(0);

  // Start pulsing
  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      true // reverse
    );
  }, []);

  // Animated background for the entire card
  const animatedCardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      ["rgba(209,213,219,0.15)", "rgba(209,213,219,0.30)"] // light mode shimmer
    ),
  }));

  // Animated style for smaller blocks
  const blockStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      ["#d1d5db", "#e5e7eb"] // darker <-> lighter
    ),
  }));

  // Dark mode versions
  const darkBlockStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      ["#374151", "#4b5563"] // gray-700 -> gray-600
    ),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={animatedCardStyle}
      className="rounded-2xl p-5 mb-4 mx-4 overflow-hidden"
    >
      <View className="flex-row items-center mb-4">
        {/* Icon skeleton */}
        <Animated.View
          className="w-14 h-14 rounded-xl"
          style={[blockStyle, darkBlockStyle]}
        />

        <View className="flex-1 ml-4">
          <Animated.View
            className="h-4 w-28 rounded-md mb-2"
            style={[blockStyle, darkBlockStyle]}
          />
          <Animated.View
            className="h-3 w-20 rounded-md"
            style={[blockStyle, darkBlockStyle]}
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <Animated.View
          className="flex-1 h-10 rounded-lg"
          style={[blockStyle, darkBlockStyle]}
        />
        <Animated.View
          className="flex-1 h-10 rounded-lg"
          style={[blockStyle, darkBlockStyle]}
        />
      </View>
    </Animated.View>
  );
};
