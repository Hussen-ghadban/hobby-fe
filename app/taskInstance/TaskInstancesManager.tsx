import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";

import { RootState } from "@/redux/store/rootReducer";
import {
    addTaskInstanceService,
    deleteTaskInstanceService,
    getAllTaskInstancesService,
    updateTaskInstanceService,
} from "@/services/taskInstance.service";

import { getAllChildrenService } from "@/services/child.services";
import { getAllTaskTemplatesService } from "@/services/taskTemplate.service";
import {
    AddTaskInstanceFormData,
    TaskInstance,
} from "@/types/taskInstance.types";
import { getTheme } from "@/theme/theme";

export default function TaskInstanceManager() {
  const { isDark } = useTheme();
    const theme = getTheme(isDark);
  
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [instances, setInstances] = useState<TaskInstance[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInstance, setEditingInstance] = useState<TaskInstance | null>(
    null
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState<AddTaskInstanceFormData>({
    templateId: "",
    childId: "",
    date: "",
    status: "PENDING",
    notes: "",
  });


  const fetchData = async () => {
    try {
      setLoading(true);

      const [instanceRes, templateRes, childrenRes] = await Promise.all([
        getAllTaskInstancesService(token!),
        getAllTaskTemplatesService(token!),
        getAllChildrenService(token!),
      ]);

      setInstances(instanceRes.data);
      setTemplates(templateRes.data);
      setChildren(childrenRes.data);
      console.log("children, templates", childrenRes.data, templateRes.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getDate = (str: string) => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const handleSave = async () => {
    if (!form.templateId || !form.childId || !form.date) {
      Alert.alert("Missing fields", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (editingInstance) {
        await updateTaskInstanceService(editingInstance.id, form, token!);
      } else {
        await addTaskInstanceService(form, token!);
      }

      setModalVisible(false);
      setEditingInstance(null);
      setForm({
        templateId: "",
        childId: "",
        date: "",
        status: "PENDING",
        notes: "",
      });

      fetchData();
      Alert.alert(
        "Success",
        editingInstance ? "Updated successfully" : "Created successfully"
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save task instance");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // Edit
  // -----------------------------------------------------
  const handleEdit = (instance: TaskInstance) => {
    setEditingInstance(instance);

    setForm({
      templateId: instance.templateId,
      childId: instance.childId,
      date: instance.date,
      status: instance.status,
      notes: instance.notes || "",
    });

    setModalVisible(true);
  };

  // -----------------------------------------------------
  // Delete
  // -----------------------------------------------------
  const handleDelete = (id: string) => {
    Alert.alert("Delete Task Instance", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteTaskInstanceService(id, token!);
            fetchData();
            Alert.alert("Deleted", "Task instance deleted");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      {/* Header */}
      <View className={`${theme.headerBgColor} px-6 pt-16 pb-6 border-b ${theme.headerBorderColor}`}>
        <Text className={`text-3xl font-bold ${theme.headerTextColor} mb-2`}>
          Task Instances
        </Text>
        <Text className={`text-sm ${theme.subTextColor}`}>
          Track tasks assigned to children
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-4">
        {/* Loading */}
        {loading && instances.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#111827"} />
            <Text className={`${theme.subTextColor} mt-4`}>Loading instances...</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && instances.length === 0 && (
          <View className="flex-1 justify-center items-center px-8">
            <View className={`w-24 h-24 ${theme.emptyIconBgColor} rounded-full items-center justify-center mb-6`}>
              <Text className="text-5xl">✅</Text>
            </View>
            <Text className={`text-xl font-bold ${theme.headerTextColor} mb-3 text-center`}>
              No Task Instances Yet
            </Text>
            <Text className={`text-center ${theme.subTextColor} mb-6`}>
              Create your first task instance to get started
            </Text>
          </View>
        )}

        {/* List */}
        {!loading && instances.length > 0 && (
          <FlatList
            data={instances}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            renderItem={({ item }) => (
              <View className={`${theme.cardBgColor} rounded-2xl p-5 mb-4 border ${theme.cardBorderColor}`}>
                <Text className={`text-lg font-bold ${theme.headerTextColor} mb-2`}>
                  {item.template!.name} → {item.child!.name}
                </Text>

                <Text className={`text-sm ${theme.subTextColor} mb-2`}>
                  📅 {item.date}
                </Text>

                {item.notes && (
                  <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}>
                    📝 {item.notes}
                  </Text>
                )}

                {/* Buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    className={`flex-1 py-3 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } border ${isDark ? "border-gray-600" : "border-gray-300"}`}
                    onPress={() => handleEdit(item)}
                  >
                    <Text className={`text-center font-semibold ${theme.headerTextColor}`}>
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable
                    className={`flex-1 py-3 rounded-lg ${
                      isDark ? "bg-red-900/20" : "bg-red-50"
                    } border ${isDark ? "border-red-800" : "border-red-200"}`}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text className={`text-center font-semibold ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Floating Add Button */}
      <Pressable
        className={`absolute bottom-6 right-6 ${theme.buttonBgColor} w-14 h-14 rounded-full items-center justify-center`}
        onPress={() => setModalVisible(true)}
      >
        <Text className={`${theme.buttonTextColor} text-2xl font-bold`}>+</Text>
      </Pressable>

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        swipeDirection={["down"]}
        onSwipeComplete={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropOpacity={0.5}
      >
        <View className={`${theme.modalBgColor} rounded-t-3xl`} style={{ maxHeight: '90%' }}>
          {/* Handle Bar */}
          <View className="py-3 items-center">
            <View className={`w-12 h-1 ${theme.handleBarColor} rounded-full`} />
          </View>

          {/* Modal Header */}
          <View className={`px-6 py-5 border-b ${theme.headerBorderColor}`}>
            <Text className={`text-2xl font-bold ${theme.headerTextColor} mb-1`}>
              {editingInstance ? "Update Instance" : "Create Instance"}
            </Text>
            <Text className={`text-sm ${theme.subTextColor}`}>
              {editingInstance ? "Modify task instance" : "Create a new task instance"}
            </Text>
          </View>

          <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
            {/* Template Select */}
            <Text className={`text-sm font-semibold mb-2 ${theme.labelColor}`}>
              Template *
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mb-5"
            >
              <View className="flex-row gap-2">
                {templates.map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => setForm({ ...form, templateId: t.id })}
                    className={`px-4 py-3 rounded-lg border ${
                      form.templateId === t.id
                        ? isDark
                          ? "border-white bg-gray-700"
                          : "border-gray-900 bg-gray-100"
                        : `${theme.inputBorderColor} ${theme.inputBgColor}`
                    }`}
                  >
                    <Text className={`font-medium ${
                      form.templateId === t.id
                        ? theme.headerTextColor
                        : theme.subTextColor
                    }`}>
                      {t.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Child Select */}
            <Text className={`text-sm font-semibold mb-2 ${theme.labelColor}`}>
              Child *
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mb-5"
            >
              <View className="flex-row gap-2">
                {children.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => setForm({ ...form, childId: c.id })}
                    className={`px-4 py-3 rounded-lg border ${
                      form.childId === c.id
                        ? isDark
                          ? "border-white bg-gray-700"
                          : "border-gray-900 bg-gray-100"
                        : `${theme.inputBorderColor} ${theme.inputBgColor}`
                    }`}
                  >
                    <Text className={`font-medium ${
                      form.childId === c.id
                        ? theme.headerTextColor
                        : theme.subTextColor
                    }`}>
                      {c.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Date */}
            <Text className={`text-sm font-semibold mb-2 ${theme.labelColor}`}>
              Date *
            </Text>
            <Pressable
              className={`border ${theme.inputBorderColor} p-4 rounded-lg mb-5 ${theme.inputBgColor}`}
              onPress={() => setShowDatePicker(true)}
            >
              <Text className={form.date ? theme.inputTextColor : theme.subTextColor}>
                {form.date || "Select Date"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={form.date ? getDate(form.date) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, d) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (d) setForm({ ...form, date: formatDate(d) });
                }}
              />
            )}

            {/* Notes */}
            <Text className={`text-sm font-semibold mb-2 ${theme.labelColor}`}>
              Notes
            </Text>
            <TextInput
              className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputTextColor} ${theme.inputBgColor} mb-6`}
              placeholder="Additional notes"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={form.notes}
              onChangeText={(t) => setForm({ ...form, notes: t })}
            />

            {/* Action Buttons */}
            <View className="gap-3">
              <Pressable
                className={`${theme.buttonBgColor} py-4 rounded-lg items-center`}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#111827" : "white"} />
                ) : (
                  <Text className={`${theme.buttonTextColor} font-semibold`}>
                    {editingInstance ? "Update" : "Create"}
                  </Text>
                )}
              </Pressable>

              <Pressable
                className={`${isDark ? "bg-gray-700" : "bg-gray-200"} py-4 rounded-lg items-center`}
                onPress={() => setModalVisible(false)}
              >
                <Text className={`${theme.headerTextColor} font-semibold`}>
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