import React from "react";
import { View } from "react-native";
import Animated, {
  FadeInRight,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

const TaskCardSkeleton = () => {
  const { isDark } = useTheme();
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const skeletonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      isDark ? ["#4b5563", "#6b7280"] : ["#d1d5db", "#e5e7eb"]
    ),
  }));

  return (
    <Animated.View 
      style={skeletonStyle}
      className="p-4 mb-3 rounded-2xl"
    >
      <View className="flex-row items-start justify-between mb-2">
        {/* Checkbox skeleton */}
        <Animated.View 
          style={skeletonStyle}
          className="w-6 h-6 rounded-lg mr-3"
        />

        {/* Text content skeleton */}
        <View className="flex-1">
          <Animated.View 
            style={skeletonStyle}
            className="h-4 w-40 rounded-md mb-2"
          />
          <Animated.View 
            style={skeletonStyle}
            className="h-3 w-28 rounded-md"
          />
        </View>

        {/* Status badge skeleton */}
        <Animated.View 
          style={skeletonStyle}
          className="w-12 h-6 rounded-full"
        />
      </View>

      {/* Badges row skeleton */}
      <View className="flex-row flex-wrap gap-2 mt-3">
        <Animated.View 
          style={skeletonStyle}
          className="h-8 w-20 rounded-lg"
        />
        <Animated.View 
          style={skeletonStyle}
          className="h-8 w-16 rounded-lg"
        />
        <Animated.View 
          style={skeletonStyle}
          className="h-8 w-24 rounded-lg"
        />
      </View>
    </Animated.View>
  );
};

export const TaskChildColumnSkeleton = ({ index }: { index: number }) => {
  const { isDark } = useTheme();
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      isDark
        ? ["#374151", "#4b5563"]
        : ["rgba(209,213,219,0.15)", "rgba(209,213,219,0.3)"]
    ),
  }));

  const skeletonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      isDark ? ["#4b5563", "#6b7280"] : ["#d1d5db", "#e5e7eb"]
    ),
  }));

  const headerColorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      isDark ? ["#4b5563", "#5a6575"] : ["#cbd5e1", "#d8e0ed"]
    ),
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
      className="mr-4 w-80"
    >
      <View 
        className="rounded-3xl overflow-hidden border-2 border-gray-300 dark:border-gray-600"
      >
        {/* Child Header Skeleton */}
        <Animated.View 
          style={headerColorStyle}
          className="px-5 py-5"
        >
          <View className="flex-row items-center mb-3">
            {/* Avatar skeleton */}
            <Animated.View 
              style={skeletonStyle}
              className="w-12 h-12 rounded-2xl mr-3"
            />
            
            <View className="flex-1">
              <Animated.View 
                style={skeletonStyle}
                className="h-5 w-32 rounded-md mb-2"
              />
              <Animated.View 
                style={skeletonStyle}
                className="h-4 w-24 rounded-md"
              />
            </View>
          </View>

          {/* Progress bar skeleton */}
          <View className="mt-2">
            <View className="flex-row justify-between mb-2">
              <Animated.View 
                style={skeletonStyle}
                className="h-3 w-16 rounded-md"
              />
              <Animated.View 
                style={skeletonStyle}
                className="h-3 w-20 rounded-md"
              />
            </View>
            <Animated.View 
              style={skeletonStyle}
              className="h-2 rounded-full"
            />
          </View>
        </Animated.View>

        {/* Tasks List Skeleton */}
        <Animated.View 
          style={cardStyle}
          className="p-4"
        >
          {/* Render skeleton task cards */}
          {[1, 2, 3, 4].map((taskIndex) => (
            <TaskCardSkeleton key={taskIndex} />
          ))}
        </Animated.View>
      </View>
    </Animated.View>
  );
};