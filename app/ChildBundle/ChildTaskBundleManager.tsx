import { RootState } from "@/redux/store/rootReducer";

import { getAllTaskTemplatesService } from "@/services/taskTemplate.service";

import {
  AddChildTaskBundleFormData,
  UpdateChildTaskBundleFormData,
  ChildTaskBundle,
} from "@/types/childTaskBundle.types";

import { useState} from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { getTheme } from "@/theme/theme";
import { addChildTaskBundleService, deleteChildTaskBundleService, getAllChildTaskBundlesService, updateChildTaskBundleService } from "@/services/childTaskBundle.services";
import { TaskTemplate } from "@/types/taskTemplate.types";
import { ChildrenManagerSkeleton } from "@/components/skeletons/ChildrenManagerSkeleton";

export default function ChildTaskBundleManager() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState<AddChildTaskBundleFormData>({
    name: "",
    templateIds: [],
  });

  const [editingBundle, setEditingBundle] = useState<ChildTaskBundle | null>(null);

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();

  // Fetch bundles
  const {
    data: bundles = [],
    isLoading,
  } = useQuery({
    queryKey: ["childTaskBundles"],
    queryFn: async () => {
      const res = await getAllChildTaskBundlesService(token!);
      return res.data;
    },
    enabled: !!token,
  });

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ["taskTemplates"],
    queryFn: async () => {
      const res = await getAllTaskTemplatesService(token!);
      return res.data;
    },
    enabled: !!token,
  });

  // --- Mutations ---
  const addBundleMutation = useMutation({
    mutationFn: (data: AddChildTaskBundleFormData) =>
      addChildTaskBundleService(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childTaskBundles"] });
      closeModal();
    },
  });

  const updateBundleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChildTaskBundleFormData }) =>
      updateChildTaskBundleService(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childTaskBundles"] });
      closeModal();
    },
  });

  const deleteBundleMutation = useMutation({
    mutationFn: (id: string) => deleteChildTaskBundleService(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childTaskBundles"] });
    },
  });

  // --- Handlers ---
  const handleSave = () => {
    if (form.templateIds.length === 0) {
      Alert.alert("Please choose at least one task template");
      return;
    }

    if (editingBundle) {
      updateBundleMutation.mutate({
        id: editingBundle.id,
        data: { name: form.name, templateIds: form.templateIds },
      });
    } else {
      addBundleMutation.mutate(form);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Bundle", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteBundleMutation.mutate(id) },
    ]);
  };

  const openModal = () => {
    setEditingBundle(null);
    setForm({ name: "", templateIds: [] });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingBundle(null);
    setForm({ name: "", templateIds: [] });
  };

  const handleEdit = (bundle: ChildTaskBundle) => {
    setEditingBundle(bundle);
    setForm({
      name: bundle.name || "",
      templateIds: bundle.templates.map((t) => t.id),
    });
    setModalVisible(true);
  };

  const toggleTemplate = (id: string) => {
    setForm((prev) => {
      const exists = prev.templateIds.includes(id);
      return {
        ...prev,
        templateIds: exists
          ? prev.templateIds.filter((x) => x !== id)
          : [...prev.templateIds, id],
      };
    });
  };

  const isMutating =
    addBundleMutation.isPending ||
    updateBundleMutation.isPending ||
    deleteBundleMutation.isPending;

  // --- Render ---
  const renderBundleItem = ({ item, index }: { item: ChildTaskBundle; index: number }) => (
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
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`text-xl font-semibold ${theme.cardNameColor}`}>
          {item.name}
        </Text>

        <View className="flex-row">
          <Pressable onPress={() => handleEdit(item)} className="mr-4">
            <Ionicons name="create-outline" size={24} color={theme.iconColor} />
          </Pressable>
          <Pressable onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </Pressable>
        </View>
      </View>

      <Text className={`text-sm ${theme.subTextColor} mb-1`}>Templates:</Text>
      {item.templates.map((t) => (
        <Text key={t.id} className={`text-sm ${theme.cardNameColor}`}>
          • {t.name}
        </Text>
      ))}
    </Animated.View>
  );

  const ListEmptyComponent = (
    <Animated.View
      entering={FadeIn.delay(300)}
      className="justify-center items-center mt-16 px-6"
    >
      <Text className="text-6xl mb-3">📦</Text>
      <Text className={`text-xl font-bold ${theme.emptyTextColor} mb-1`}>
        No Bundles Yet
      </Text>
      <Text className={`text-sm ${theme.subTextColor}`}>Add one to get started</Text>
    </Animated.View>
  );
  const renderHeader = () => (
    <View className={`${theme.headerBgColor} px-6 pt-8 pb-4 mb-6 border-b ${theme.headerBorderColor}`}>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className={`text-3xl font-bold ${theme.headerTextColor}`}>Task Bundles</Text>
          <Text className={`text-sm mt-1 ${theme.subTextColor}`}>
            Manage bundles of task templates
          </Text>
        </View>

        <View className={`${theme.countBgColor} px-4 py-2 rounded-xl`}>
          <Text className={`${theme.countTextColor} font-semibold`}>
            {bundles.length}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      <FlatList
        data={isLoading && bundles.length === 0 ? [1, 2, 3] : bundles}
        keyExtractor={(item, index) => (typeof item === 'number' ? `skeleton-${item}-${index}` : (item as ChildTaskBundle).id)}
        renderItem={({ item, index }) => {
          if (isLoading && bundles.length === 0) return <ChildrenManagerSkeleton index={index} />;
          return renderBundleItem({ item: item as ChildTaskBundle, index: index as number });
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (!isLoading ? ListEmptyComponent : null)}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add FAB */}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className={`${theme.modalBgColor} rounded-t-3xl pb-8`}>
            <View className="py-3 items-center">
              <View className={`w-14 h-1.5 rounded-full ${theme.handleBarColor}`} />
            </View>

            <View className="px-6 mb-4">
              <Text className={`text-2xl font-bold ${theme.headerTextColor}`}>
                {editingBundle ? "Edit Bundle" : "Add Bundle"}
              </Text>
              <Text className={`text-sm ${theme.subTextColor} mt-1`}>
                {editingBundle
                  ? "Update bundle templates"
                  : "Choose task templates"}
              </Text>
            </View>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className={`text-sm font-medium ${theme.labelColor} mb-2`}>Bundle Name</Text>
                <TextInput
                  placeholder="Bundle name"
                  placeholderTextColor="#9ca3af"
                  className={`border ${theme.inputBorderColor} p-4 rounded-lg ${theme.inputBgColor} ${theme.inputTextColor}`}
                  value={form.name}
                  onChangeText={(t) => setForm((prev) => ({ ...prev, name: t }))}
                />
              </View>

              <Text className={`text-sm font-medium ${theme.labelColor} mb-2`}>
                Task Templates
              </Text>

              {templates.map((t:TaskTemplate) => {
                const selected = form.templateIds.includes(t.id);
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => toggleTemplate(t.id)}
                    className={`flex-row items-center mb-3 p-4 rounded-xl ${theme.inputBgColor}`}
                    style={{
                      borderWidth: 2,
                      borderColor: selected ? theme.accentColor : (isDark ? "#4b5563" : "#d1d5db"),
                    }}
                  >
                    <Ionicons
                      name={selected ? "checkbox" : "square-outline"}
                      size={24}
                      color={selected ? (isDark ? "white" : "black") : (isDark ? "#9ca3af" : "#6b7280")}
                      style={{ marginRight: 12 }}
                    />
                    <Text className={`${theme.cardNameColor} text-base`}>
                      {t.name}
                    </Text>
                  </Pressable>
                );
              })}

              {/* Save */}
              <Pressable
                onPress={handleSave}
                disabled={isMutating}
                className={`mt-8 py-4 rounded-2xl ${theme.buttonBgColor}`}
              >
                {isMutating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${theme.buttonTextColor}`}
                  >
                    {editingBundle ? "Update Bundle" : "Add Bundle"}
                  </Text>
                )}
              </Pressable>

              {/* Cancel */}
              <Pressable
                onPress={closeModal}
                disabled={isMutating}
                className={`mt-3 py-4 rounded-2xl border ${isDark ? 'border-gray-600' : 'border-gray-400/40'}`}
              >
                <Text className={`text-center font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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