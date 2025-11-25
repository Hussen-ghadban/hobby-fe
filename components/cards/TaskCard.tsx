import React, { useState, memo } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { TaskInstance } from "@/types/taskInstanceByChildren.types";

type Props = {
  task: TaskInstance;
  childColor: string;
  onStatusToggle: (taskId: string) => void;
  isDark: boolean;
};

const TaskCard = memo(({ task, childColor, onStatusToggle, isDark }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { 
          emoji: "✅", 
          color: isDark ? "text-green-400" : "text-green-600", 
          bg: isDark ? "bg-green-900/20" : "bg-green-50" 
        };
      case "PENDING":
        return { 
          emoji: "⏳", 
          color: isDark ? "text-blue-400" : "text-blue-500", 
          bg: isDark ? "bg-blue-900/20" : "bg-blue-50" 
        };
      default:
        return { 
          emoji: "⚪", 
          color: isDark ? "text-gray-400" : "text-gray-600", 
          bg: isDark ? "bg-gray-700" : "bg-gray-50" 
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const badgeBg = isDark ? "bg-gray-700" : "bg-gray-50";
  const notesBg = isDark ? "bg-amber-900/20" : "bg-amber-50";
  const notesBorder = isDark ? "border-amber-800" : "border-amber-100";
  const notesText = isDark ? "text-gray-300" : "text-gray-700";

  const handleToggle = async () => {
    setIsUpdating(true);
    await onStatusToggle(task.id);
    setIsUpdating(false);
  };

  return (
    <Animated.View 
      entering={FadeIn}
      className={`${cardBg} p-4 mb-3 rounded-2xl border ${
        isDark ? "border-gray-700" : "border-gray-100"
      }`}
      style={{ 
        borderLeftWidth: 4, 
        borderLeftColor: childColor 
      }}
    >
      <View className="flex-row items-start justify-between mb-2">
        
        <Pressable onPress={handleToggle} disabled={isUpdating} className="mr-3 mt-0.5">
          <View 
            className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
              task.status === "COMPLETED" 
                ? "bg-green-500 border-green-500" 
                : isDark 
                  ? "bg-gray-800 border-gray-600" 
                  : "bg-white border-gray-300"
            }`}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color={task.status === "COMPLETED" ? "white" : "#6366f1"} />
            ) : task.status === "COMPLETED" ? (
              <Text className="text-white text-xs font-bold">✓</Text>
            ) : null}
          </View>
        </Pressable>

        <View className="flex-1">
          <Text className={`font-bold text-base ${textColor} mb-1`}>
            {task.templateName}
          </Text>
          <Text className={`${subTextColor} text-sm`}>
            {task.templateCategory}
          </Text>
        </View>

        <View className={`px-3 py-1 rounded-full ${statusConfig.bg}`}>
          <Text className="text-xs font-semibold">
            {statusConfig.emoji}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-3">
        <View className={`flex-row items-center ${badgeBg} px-3 py-1.5 rounded-lg`}>
          <Text className={`text-xs ${subTextColor}`}>
            📅 {new Date(task.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View className={`flex-row items-center px-3 py-1.5 rounded-lg ${statusConfig.bg}`}>
          <Text className={`text-xs font-semibold ${statusConfig.color}`}>
            {task.status}
          </Text>
        </View>

        {task.recurrenceType && (
          <View className={`flex-row items-center px-3 py-1.5 rounded-lg ${
            isDark ? "bg-indigo-900/20" : "bg-indigo-50"
          }`}>
            <Text className={`text-xs font-medium ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}>
              🔁 {task.recurrenceType}
            </Text>
          </View>
        )}
      </View>

      {task.notes && (
        <View className={`mt-3 p-3 ${notesBg} rounded-xl border ${notesBorder}`}>
          <Text className={`text-sm ${notesText} leading-5`}>
            💭 {task.notes}
          </Text>
        </View>
      )}
    </Animated.View>
  );
});

TaskCard.displayName = "TaskCard";
export default TaskCard;
