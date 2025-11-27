import { RootState } from "@/redux/store/rootReducer";
import {
  addChildService,
  deleteChildService,
  getAllChildrenService,
  updateChildService,
} from "@/services/child.services";
import {
  AddChildFormData,
  Child,
  UpdateChildFormData,
} from "@/types/child.types";
import { useState, useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import Animated, { FadeInDown, Layout, FadeIn } from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChildrenManagerSkeleton } from "@/components/skeletons/ChildrenManagerSkeleton";
import { getTheme } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ChildrenManager() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<
    AddChildFormData | UpdateChildFormData
  >({ name: "", color: "#6366f1" });
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();

  const colorOptions = useMemo(
    () => [
      "#6366f1",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#64748b",
    ],
    []
  );

  const { data: children = [], isLoading, isError, error } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const res = await getAllChildrenService(token!);
      return res.data;
    },
    enabled: !!token,
  });

  const addChildMutation = useMutation({
    mutationFn: (data: AddChildFormData) => addChildService(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      closeModal();
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChildFormData }) =>
      updateChildService(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      closeModal();
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: (id: string) => deleteChildService(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });

  const handleSave = useCallback(() => {
    if (!form.name!.trim()) {
      Alert.alert("Enter name", "Child name cannot be empty.");
      return;
    }

    if (editingChild) {
      updateChildMutation.mutate({ id: editingChild.id, data: form });
    } else {
      addChildMutation.mutate(form as AddChildFormData);
    }
  }, [form, editingChild]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete Child", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteChildMutation.mutate(id) },
    ]);
  }, []);

  const openModal = () => {
    setEditingChild(null);
    setForm({ name: "", color: "#6366f1" });
    setModalVisible(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingChild(null);
    setForm({ name: "", color: "#6366f1" });
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setForm({ name: child.name, color: child.color });
    setModalVisible(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const isMutating =
    addChildMutation.isPending ||
    updateChildMutation.isPending ||
    deleteChildMutation.isPending;

  const renderChildItem = ({ item, index }: { item: Child; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 70).springify()}
      layout={Layout.springify()}
      className={`rounded-2xl mx-4 mb-4 p-5 ${theme.cardBgColor}`}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      <View className="flex-row items-center mb-4">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: item.color }}
        >
          <Text className="text-white text-xl font-bold">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text className={`text-xl font-semibold ${theme.cardNameColor}`}>
            {item.name}
          </Text>
        </View>

        <Pressable onPress={() => handleEdit(item)} className="mr-3">
          <Ionicons name="create-outline" size={24} color={theme.iconColor} />
          
        </Pressable>

        <Pressable onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>
    </Animated.View>
  );

  const ListEmptyComponent = (
    <Animated.View
      entering={FadeIn.delay(300)}
      className="justify-center items-center mt-16 px-6"
    >
      <Text className="text-6xl mb-3">👶</Text>
      <Text className={`text-xl font-bold ${theme.emptyTextColor} mb-1`}>
        No Children Yet
      </Text>
      <Text className={`text-sm ${theme.subTextColor}`}>Add one to get started</Text>
    </Animated.View>
  );
  const renderHeader = () => (
    <View className={`${theme.headerBgColor} px-6 pt-12 pb-4 mb-6 border-b ${theme.headerBorderColor}`}>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className={`text-3xl font-bold ${theme.headerTextColor}`}>Children</Text>
          <Text className={`text-sm mt-1 ${theme.subTextColor}`}>
            Manage your children profiles
          </Text>
        </View>

        <View className={`${theme.countBgColor} px-4 py-2 rounded-xl`}>
          <Text className={`${theme.countTextColor} font-semibold`}>{children.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      <FlatList
        data={isLoading && children.length === 0 ? [1, 2, 3] : children}
        keyExtractor={(item, index) => (typeof item === "number" ? `skeleton-${item}-${index}` : item.id)}
        renderItem={({ item, index }) => {
          if (isLoading && children.length === 0) {
            return <ChildrenManagerSkeleton index={index} />;
          }
          return renderChildItem({ item: item as Child, index });
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (!isLoading ? ListEmptyComponent : null)}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <Pressable
        onPress={openModal}
        disabled={isMutating}
        className={`absolute bottom-7 right-7 w-16 h-16 rounded-full items-center justify-center ${theme.fabBgColor}`}
        style={{
          shadowColor: "#000",
          shadowRadius: 8,
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Ionicons name="add" size={36} color={theme.fabTextColor} />
      </Pressable>

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        swipeDirection={["down"]}
        onSwipeComplete={closeModal}
        backdropOpacity={0.4}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View className={`${theme.modalBgColor} rounded-t-3xl pb-8`}>
            <View className="py-3 items-center">
              <View className={`w-14 h-1.5 rounded-full ${theme.handleBarColor}`} />
            </View>

            <View className="px-6 mb-4">
              <Text className={`text-2xl font-bold ${theme.headerTextColor}`}>
                {editingChild ? "Edit Child" : "Add Child"}
              </Text>
              <Text className={`text-sm ${theme.subTextColor} mt-1`}>
                {editingChild ? "Update child details" : "Enter child information"}
              </Text>
            </View>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
              <Text className={`text-sm font-medium ${theme.labelColor} mb-1`}>Name</Text>
              <TextInput
                ref={inputRef}
                placeholder="Child name"
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
                className={`px-4 py-3 rounded-2xl border ${theme.inputBorderColor} ${theme.inputBgColor} ${theme.inputTextColor}`}
                placeholderTextColor={"#9ca3af"}
              />

              <Text className={`text-sm font-medium mt-5 mb-2 ${theme.labelColor}`}>
                Choose a Color
              </Text>

              <View className="flex-row flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => setForm({ ...form, color })}
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: color,
                      borderWidth: form.color === color ? 3 : 1,
                      borderColor: form.color === color ? theme.accentColor : "transparent",
                    }}
                  >
                    {form.color === color && (
                      <Ionicons name="checkmark" size={20} color="white" />
                    )}
                  </Pressable>
                ))}
              </View>

              {/* Save */}
              <Pressable
                onPress={handleSave}
                disabled={isMutating}
                className={`mt-8 py-4 rounded-2xl ${theme.buttonBgColor}`}
              >
                {isMutating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className={`text-center font-semibold text-base ${theme.buttonTextColor}`}>
                    {editingChild ? "Update Child" : "Add Child"}
                  </Text>
                )}
              </Pressable>

              {/* Cancel */}
              <Pressable
                onPress={closeModal}
                disabled={isMutating}
                className="mt-3 py-4 rounded-2xl border border-gray-400/40"
              >
                <Text className="text-center font-semibold text-gray-500">
                  Cancel
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
