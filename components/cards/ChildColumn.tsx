import React, { memo } from "react";
import { View, Text, FlatList } from "react-native";
import Animated, { FadeInRight,Layout  } from "react-native-reanimated";
import { TaskChildGroup } from "@/types/taskInstanceByChildren.types";
import TaskCard from "./TaskCard";

type Props = {
  child: TaskChildGroup;
  index: number;
  onStatusToggle: (taskId: string) => void;
  isDark: boolean;
};

const ChildColumn = memo(({ child, index, onStatusToggle, isDark }: Props) => {
  const completedCount = child.tasks.filter(t => t.status === "COMPLETED").length;
  const totalCount = child.tasks.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const columnBg = isDark ? "bg-gray-800" : "bg-white";
  const emptyTextColor = isDark ? "text-gray-400" : "text-gray-400";

   const sortedTasks = [...child.tasks].sort((a, b) => {
    if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
    if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
    return 0;
  });
  return (
    <Animated.View entering={FadeInRight.delay(index * 100)} className="mr-4 w-80">
      <View
        className={`${columnBg} rounded-3xl overflow-hidden border-2`}
        style={{ borderColor: child.color }}
      >
        {/* HEADER */}
        <View className="px-5 py-5" style={{ backgroundColor: child.color }}>
          <View className="flex-row items-center mb-3">
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            >
              <Text className="text-white text-xl font-bold">
                {child.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-white text-xl font-bold">{child.name}</Text>
              <Text className="text-white/90 text-sm font-medium">
                {totalCount} {totalCount === 1 ? "task" : "tasks"}
              </Text>
            </View>
          </View>

          {/* PROGRESS */}
          {totalCount > 0 && (
            <View className="mt-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-white/90 text-xs font-semibold">Progress</Text>

                <Text className="text-white text-xs font-bold">
                  {completedCount}/{totalCount} ({Math.round(completionRate)}%)
                </Text>
              </View>

              <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-white rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </View>
            </View>
          )}
        </View>

        {/* TASKS LIST */}
        <View className="p-4">
          {child.tasks.length > 0 ? (
            <FlatList
              data={sortedTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Animated.View layout={Layout.springify()}>
                  <TaskCard
                    task={item}
                    childColor={child.color}
                    onStatusToggle={onStatusToggle}
                    isDark={isDark}
                  />
                </Animated.View>
              )}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          ) : (
            <View className="py-12 items-center">
              <Text className="text-6xl mb-3">📝</Text>
              <Text className={`${emptyTextColor} text-sm font-medium`}>No tasks yet</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

ChildColumn.displayName = "ChildColumn";
export default ChildColumn;
