import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { TaskChildGroup } from "@/types/taskInstanceByChildren.types";
import { getTaskInstancesByChildrenService, updateTaskInstanceStatus } from "@/services/taskInstance.service";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/rootReducer";
import { useTheme } from "@/context/ThemeContext";
import Animated, { FadeIn } from 'react-native-reanimated';
import { TaskChildColumnSkeleton } from "@/components/skeletons/TaskChildColumnSkeleton ";
import ChildColumn from "@/components/cards/ChildColumn";
import { getTheme } from "@/theme/theme";

const TaskInstanceByChildrenScreen = () => {
  const { isDark } = useTheme();
      const theme = getTheme(isDark);
  
  const [data, setData] = useState<TaskChildGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const fetchData = useCallback(async () => {
    try {
      const response = await getTaskInstancesByChildrenService(token ?? undefined);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching task instances:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleStatusToggle = useCallback(async (taskId: string) => {
    try {
      const response = await updateTaskInstanceStatus(taskId, token ?? undefined);
      
      const updatedTask = response.data;
            
      // Update the local state with the new task data
      setData(prevData => 
        prevData.map(child => ({
          ...child,
          tasks: child.tasks.map(task => 
            task.id === taskId ? { ...task, status: updatedTask.status } : task
          )
        }))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

if (loading) {
  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      <View className={`${theme.headerBgColor} px-6 pt-16 pb-6 border-b ${theme.headerBorderColor}`}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-3xl font-bold ${theme.headerTextColor} mb-2`}>
              Tasks Overview
            </Text>
            <Text className={`${theme.subTextColor} text-sm`}>
              Track progress by child
            </Text>
          </View>
          {/* Loading indicator for count */}
          <View className={`${theme.countBgColor} px-4 py-2 rounded-lg`}>
            <ActivityIndicator size="small" color={isDark ? "#fff" : "#000"} />
          </View>
        </View>
      </View>

      {/* Horizontal ScrollView for skeleton columns */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingTop: 26,
          paddingBottom: 90
        }}
      >
        {/* Render skeleton columns horizontally */}
        {[1, 2, 3, 4].map((index) => (
          <TaskChildColumnSkeleton 
            key={index} 
            index={index} 
          />
        ))}
      </ScrollView>
    </View>
  );
}
  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      {/* Header */}

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
      <View className={`${theme.headerBgColor} px-6 pt-16 pb-6 border-b ${theme.headerBorderColor}`}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-3xl font-bold ${theme.headerTextColor} mb-2`}>
              Tasks Overview
            </Text>
            <Text className={`${theme.subTextColor} text-sm`}>
              Track progress by child
            </Text>
          </View>
          <View className={`${theme.countBgColor} px-4 py-2 rounded-lg`}>
            <Text className={`${theme.countTextColor} font-semibold`}>
              {data.length}
            </Text>
          </View>
        </View>
      </View>
        {data.length === 0 ? (
          <Animated.View 
            entering={FadeIn}
            className="flex-1 justify-center items-center px-8"
          >
            <View className={`w-24 h-24 ${theme.emptyIconBgColor} rounded-full items-center justify-center mb-6`}>
              <Text className="text-5xl">📋</Text>
            </View>
            <Text className={`text-xl font-bold ${theme.headerTextColor} mb-3 text-center`}>
              No Tasks Yet
            </Text>
            <Text className={`text-center ${theme.subTextColor}`}>
              Tasks will appear here once you add children and assign tasks to them.
            </Text>
          </Animated.View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingTop: 26 }}
            bounces={true}
          >
            {data.map((child, index) => (
              <ChildColumn 
                key={child.id} 
                child={child} 
                index={index}
                onStatusToggle={handleStatusToggle}
                isDark={isDark}
              />
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
};

export default TaskInstanceByChildrenScreen;