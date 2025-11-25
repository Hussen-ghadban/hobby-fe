import { TaskTemplateSkeleton } from "@/components/skeletons/TaskTemplateSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { RootState } from "@/redux/store/rootReducer";
import {
  addTaskTemplateService,
  deleteTaskTemplateService,
  getAllTaskTemplatesService,
  updateTaskTemplateService,
} from "@/services/taskTemplate.service";
import { getTheme } from "@/theme/theme";
import { AddTaskTemplateFormData, TaskTemplate } from "@/types/taskTemplate.types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";

const RECURRENCE_OPTIONS = [
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKDAYS" },
  { label: "Custom Days", value: "CUSTOM_DAYS" },
];

const DAYS_OF_WEEK = [
  { label: "Sun", value: "0" },
  { label: "Mon", value: "1" },
  { label: "Tue", value: "2" },
  { label: "Wed", value: "3" },
  { label: "Thu", value: "4" },
  { label: "Fri", value: "5" },
  { label: "Sat", value: "6" },
];

export default function TaskTemplatesManager() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const [form, setForm] = useState<AddTaskTemplateFormData & { recurrenceDays?: string[] }>({
    name: "",
    description: "",
    category: "",
    priority: 1,
    startDate: "",
    recurrenceType: "DAILY",
    recurrenceDays: [],
  });

  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

 
  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await getAllTaskTemplatesService(token!);
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch task templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        closeModal();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [modalVisible]);

  // Save template (add/update)
  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Validation Error", "Template name is required");
      return;
    }

    if (form.recurrenceType === "CUSTOM_DAYS" && (!form.recurrenceDays || form.recurrenceDays.length === 0)) {
      Alert.alert("Validation Error", "Please select at least one day for custom recurrence");
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        name: form.name,
        description: form.description,
        category: form.category,
        priority: form.priority,
        startDate: form.startDate,
        recurrenceType: form.recurrenceType,
      };

      if (form.recurrenceType === "CUSTOM_DAYS") {
        payload.recurrenceDays = form.recurrenceDays;
      }

      if (editingTemplate) {
        await updateTaskTemplateService(editingTemplate.id, payload, token!);
      } else {
        await addTaskTemplateService(payload, token!);
      }
      closeModal();
      fetchTemplates();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save task template");
    } finally {
      setLoading(false);
    }
  };

  // Edit template
  const handleEdit = (template: TaskTemplate) => {
    setEditingTemplate(template);
    setForm({
      name: template.name,
      description: template.description || "",
      category: template.category || "",
      priority: template.priority || 1,
      startDate: template.startDate,
      recurrenceType: template.recurrenceType,
      recurrenceDays: (template as any).recurrenceDays || [],
    });
    setModalVisible(true);
  };

  // Delete template
  const handleDelete = (id: string) => {
    Alert.alert("Delete Task Template", "Are you sure you want to delete this template?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteTaskTemplateService(id, token!);
            fetchTemplates();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete task template");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const closeModal = () => {
    setModalVisible(false);
    setForm({
      name: "",
      description: "",
      category: "",
      priority: 1,
      startDate: "",
      recurrenceType: "DAILY",
      recurrenceDays: [],
    });
    setEditingTemplate(null);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, startDate: formatDate(selectedDate) });
    }
  };

  const getDateFromString = (dateStr: string) => {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const toggleRecurrenceDay = (day: string) => {
    const currentDays = form.recurrenceDays || [];
    if (currentDays.includes(day)) {
      setForm({ ...form, recurrenceDays: currentDays.filter(d => d !== day) });
    } else {
      setForm({ ...form, recurrenceDays: [...currentDays, day] });
    }
  };

  const getDaysDisplay = (days?: string[]) => {
    if (!days || days.length === 0) return "";
    return days
      .sort()
      .map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <View className={`flex-1 ${theme.bgColor}`}>
              <View className={`${theme.headerBgColor} px-6 pt-16 pb-8`}>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text className={`text-3xl font-bold ${theme.headerTextColor} mb-1`}>
                      Templates
                    </Text>
                    <Text className={`text-sm ${theme.subTextColor}`}>
                      {templates.length} reusable task {templates.length === 1 ? 'template' : 'templates'}
                    </Text>
                  </View>
                  <View className={`${isDark ? "bg-blue-500/10" : "bg-blue-500/5"} w-14 h-14 rounded-2xl items-center justify-center`}>
                    <Text className="text-2xl">📋</Text>
                  </View>
                </View>
              </View>
      {/* Content */}
      <View className="flex-1 px-6 pt-4">
        {/* Loading State */}
        {loading && templates.length === 0 && (
  <FlatList
    data={[1, 2, 3, 4, 5]}
    keyExtractor={(i) => i.toString()}
    renderItem={({ index }) => <TaskTemplateSkeleton index={index} />}
    showsVerticalScrollIndicator={false}
  />
)}


        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <View className="flex-1 justify-center items-center px-8">
            <View className={`w-20 h-20 ${theme.emptyIconBgColor} rounded-full items-center justify-center mb-4`}>
              <Text className="text-4xl">📋</Text>
            </View>
            <Text className={`text-xl font-bold ${theme.headerTextColor} mb-2`}>
              No Templates Yet
            </Text>
            <Text className={`text-center ${theme.subTextColor}`}>
              Create your first task template to streamline recurring activities
            </Text>
          </View>
        )}

        {/* Templates List */}
{templates.length > 0 && (
          <FlatList
            data={templates}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            renderItem={({ item }) => (
              <View className="px-1 mb-4">
                <View className={`${theme.cardBgColor} rounded-3xl overflow-hidden ${theme.cardBorderColor} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  {/* Priority Banner */}
                  <View className={`h-1.5 ${
                    String(item.priority) === "HIGH" ? "bg-red-500" :
                    String(item.priority) === "MEDIUM" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  
                  <View className="p-5">
                    {/* Header Section */}
                    <View className="flex-row items-start justify-between mb-4">
                      <View className="flex-1 mr-4">
                        <Text className={`text-xl font-bold ${theme.headerTextColor} mb-1.5`}>
                          {item.name}
                        </Text>
                        {item.description && (
                          <Text className={`text-sm ${theme.subTextColor} leading-5`}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      
                      <View className={`${
                        String(item.priority) === "HIGH" 
                          ? isDark ? "bg-red-500/15" : "bg-red-50"
                          : String(item.priority) === "MEDIUM"
                          ? isDark ? "bg-amber-500/15" : "bg-amber-50"
                          : isDark ? "bg-blue-500/15" : "bg-blue-50"
                      } px-3 py-1.5 rounded-xl`}>
                          <Text className={`text-xs font-bold ${
                          String(item.priority) === "HIGH"
                            ? isDark ? "text-red-400" : "text-red-600"
                            : String(item.priority) === "MEDIUM"
                            ? isDark ? "text-amber-400" : "text-amber-600"
                            : isDark ? "text-blue-400" : "text-blue-600"
                        }`}>
                          {item.priority}
                        </Text>
                      </View>
                    </View>

                    {/* Divider */}
                    <View className={`h-px ${isDark ? "bg-gray-700" : "bg-gray-200"} mb-4`} />

                    {/* Metadata Grid */}
                    <View className="mb-4">
                      <View className="flex-row flex-wrap gap-3">
                        {item.category && (
                          <View className="flex-row items-center">
                            <View className={`${isDark ? "bg-purple-500/15" : "bg-purple-50"} w-8 h-8 rounded-lg items-center justify-center mr-2`}>
                              <Text className="text-base">📁</Text>
                            </View>
                            <Text className={`text-sm font-medium ${theme.headerTextColor}`}>
                              {item.category}
                            </Text>
                          </View>
                        )}
                        
                        <View className="flex-row items-center">
                          <View className={`${isDark ? "bg-green-500/15" : "bg-green-50"} w-8 h-8 rounded-lg items-center justify-center mr-2`}>
                            <Text className="text-base">🔄</Text>
                          </View>
                          <Text className={`text-sm font-medium ${theme.headerTextColor}`}>
                            {item.recurrenceType}
                          </Text>
                        </View>
                      </View>

                      {item.recurrenceType === "CUSTOM_DAYS" && (item as any).recurrenceDays && (
                        <View className={`${isDark ? "bg-indigo-500/10" : "bg-indigo-50"} rounded-xl p-3 mt-3`}>
                          <Text className={`text-xs font-semibold ${isDark ? "text-indigo-400" : "text-indigo-700"} mb-1`}>
                            CUSTOM SCHEDULE
                          </Text>
                          <Text className={`text-sm font-medium ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>
                            {getDaysDisplay((item as any).recurrenceDays)}
                          </Text>
                        </View>
                      )}

                      {item.startDate && (
                        <View className={`${isDark ? "bg-gray-700/50" : "bg-gray-50"} rounded-xl p-3 mt-3 flex-row items-center`}>
                          <Text className="text-base mr-2">📅</Text>
                          <View>
                            <Text className={`text-xs font-semibold ${theme.subTextColor} mb-0.5`}>
                              START DATE
                            </Text>
                            <Text className={`text-sm font-medium ${theme.headerTextColor}`}>
                              {new Date(item.startDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                      <Pressable 
                        onPress={() => handleEdit(item)}
                        className={`flex-1 ${isDark ? "bg-blue-500/15" : "bg-blue-50"} rounded-xl py-3 flex-row items-center justify-center`}
                      >
                        <Ionicons 
                          name="create-outline" 
                          size={18} 
                          color={isDark ? "#60a5fa" : "#2563eb"} 
                        />
                        <Text className={`ml-2 font-semibold text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                          Edit
                        </Text>
                      </Pressable>

                      <Pressable 
                        onPress={() => handleDelete(item.id)}
                        className={`flex-1 ${isDark ? "bg-red-500/15" : "bg-red-50"} rounded-xl py-3 flex-row items-center justify-center`}
                      >
                        <Ionicons 
                          name="trash-outline" 
                          size={18} 
                          color={isDark ? "#f87171" : "#dc2626"} 
                        />
                        <Text className={`ml-2 font-semibold text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Floating Add Button */}
<Pressable
  onPress={() => setModalVisible(true)}
  className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center ${theme.fabBgColor}`}
  style={{ zIndex: 1000 }}
>
  <Ionicons name="add" size={32} color={theme.fabTextColor} />
</Pressable>


      {/* Add/Update Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        // swipeDirection={["down"]} 
        // onSwipeComplete={closeModal}
        propagateSwipe
        useNativeDriverForBackdrop
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropOpacity={0.5}
      >
        <View
          className={`${theme.modalBgColor} rounded-t-3xl overflow-hidden`}
          style={{ flex: 0.9}}
        >
          <View className="py-3 items-center">
            <View className={`w-12 h-1 ${theme.handleBarColor} rounded-full`} />
          </View>

          <View className={`px-6 py-5  ${theme.modalHeaderBorderColor}`}>
            <Text className={`text-2xl font-bold ${theme.headerTextColor}`}>
              {editingTemplate ? "Update Template" : "Create Template"}
            </Text>
            <Text className={`${theme.subTextColor} text-sm mt-1`}>
              {editingTemplate ? "Modify template details" : "Define a reusable task template"}
            </Text>
          </View>

          {/* Modal Body */}
          <ScrollView
            className="px-6 py-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {/* Name */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                Template Name *
              </Text>
              <TextInput
                placeholder="e.g., Morning Routine"
                placeholderTextColor="#9ca3af"
                className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputBgColor} ${theme.inputTextColor}`}
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
              />
            </View>

            {/* Description */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                Description
              </Text>
              <TextInput
                placeholder="Brief description of the task"
                placeholderTextColor="#9ca3af"
                className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputBgColor} ${theme.inputTextColor}`}
                value={form.description}
                onChangeText={(t) => setForm({ ...form, description: t })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Category */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                Category
              </Text>
              <TextInput
                placeholder="e.g., Personal, Work, Health"
                placeholderTextColor="#9ca3af"
                className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputBgColor} ${theme.inputTextColor}`}
                value={form.category}
                onChangeText={(t) => setForm({ ...form, category: t })}
              />
            </View>

            {/* Priority */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                Priority (Number)
              </Text>
              <TextInput
                placeholder="e.g., 1, 2, 3"
                placeholderTextColor="#9ca3af"
                className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputBgColor} ${theme.inputTextColor}`}
                value={form.priority?.toString()}
                onChangeText={(t) => {
                  const num = parseInt(t) || 1;
                  setForm({ ...form, priority: num });
                }}
                keyboardType="numeric"
              />
            </View>

            {/* Recurrence */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                Recurrence
              </Text>
              <View className="flex-row flex-wrap gap-2" pointerEvents="box-none">
                {RECURRENCE_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    className={`px-4 py-3 rounded-lg border ${
                      form.recurrenceType === option.value
                        ? isDark 
                          ? "border-white bg-gray-700" 
                          : "border-gray-900 bg-gray-100"
                        : isDark
                          ? "border-gray-600 bg-gray-800"
                          : "border-gray-300 bg-gray-50"
                    }`}
                    onPress={() => {
                      setForm({
                        ...form,
                        recurrenceType: option.value as any,
                        recurrenceDays: option.value === "CUSTOM_DAYS" ? form.recurrenceDays : []
                      });
                    }}
                    onPressIn={(e) => e.stopPropagation()}
                  >
                    <Text className={`font-semibold ${
                      form.recurrenceType === option.value
                        ? theme.headerTextColor
                        : theme.subTextColor
                    }`}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Custom Days Selection */}
            {form.recurrenceType === "CUSTOM_DAYS" && (
              <View className="mb-5">
                <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                  Select Days *
                </Text>
                <View className="flex-row flex-wrap gap-2" pointerEvents="box-none">
                  {DAYS_OF_WEEK.map((day) => (
                    <Pressable
                      key={day.value}
                      className={`px-4 py-3 rounded-lg border ${
                        form.recurrenceDays?.includes(day.value)
                          ? isDark 
                            ? "border-white bg-gray-700" 
                            : "border-gray-900 bg-gray-100"
                          : isDark
                            ? "border-gray-600 bg-gray-800"
                            : "border-gray-300 bg-gray-50"
                      }`}
                      onPress={() => toggleRecurrenceDay(day.value)}
                      onPressIn={(e) => e.stopPropagation()}
                    >
                      <Text className={`font-semibold ${
                        form.recurrenceDays?.includes(day.value)
                          ? theme.headerTextColor
                          : theme.subTextColor
                      }`}>
                        {day.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Start Date */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-2`}>
                Start Date
              </Text>
              <Pressable
                className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputBgColor}`}
                onPress={() => setShowStartDatePicker(true)}
                onPressIn={(e) => e.stopPropagation()}
              >
                <Text className={form.startDate ? theme.inputTextColor : "text-gray-400"}>
                  {form.startDate || 'Select start date'}
                </Text>
              </Pressable>
              {showStartDatePicker && (
                <DateTimePicker
                  value={getDateFromString(form.startDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleStartDateChange}
                />
              )}
            </View>

            {/* Action Buttons */}
            <View className="gap-3 pb-6">
              <Pressable
                className={`${isDark ? "bg-white" : "bg-gray-900"} py-4 rounded-lg items-center`}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#111827" : "white"} />
                ) : (
                  <Text className={`font-semibold ${isDark ? "text-gray-900" : "text-white"}`}>
                    {editingTemplate ? "Update Template" : "Create Template"}
                  </Text>
                )}
              </Pressable>

              <Pressable
                className={`${isDark ? "bg-gray-700" : "bg-gray-200"} py-4 rounded-lg items-center`}
                onPress={closeModal}
                disabled={loading}
              >
                <Text className={`font-semibold ${theme.headerTextColor}`}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}