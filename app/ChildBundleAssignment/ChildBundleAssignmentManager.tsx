import React, { useCallback, useMemo, useRef, useState } from "react";
import { RootState } from "@/redux/store/rootReducer";

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
import { ChildrenManagerSkeleton } from "@/components/skeletons/ChildrenManagerSkeleton";
import { getTheme } from "@/theme/theme";
import { AddChildBundleAssignmentFormData, UpdateChildBundleAssignmentFormData } from "@/types/childBundleAssignment.types";
import { getAllChildTaskBundlesService } from "@/services/childTaskBundle.services";
import { getAllChildrenService } from "@/services/child.services";
import { addChildBundleAssignmentService, deleteChildBundleAssignmentService, getAllChildBundleAssignmentsService, updateChildBundleAssignmentService } from "@/services/childBundleAssignment.services";
import { Child } from "@/types/child.types";

/**
 * Component: ChildBundleAssignmentManager
 *
 * - Bundle dropdown (single select)
 * - Children multi-select (checkbox style)
 * - Add / Update (only childIds) / Delete
 */

export default function ChildBundleAssignmentManager() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);

  // Form state: bundleId (string) and selected childIds (string[])
  const [form, setForm] = useState<AddChildBundleAssignmentFormData>({
    bundleId: "",
    childIds: [],
  });

  const searchInputRef = useRef<TextInput | null>(null);
  const [bundleDropdownOpen, setBundleDropdownOpen] = useState(false);
  const [childrenDropdownSearch, setChildrenDropdownSearch] = useState("");

  // Fetch bundles for dropdown
  const {
    data: bundlesResponse,
    isLoading: bundlesLoading,
  } = useQuery({
    queryKey: ["childTaskBundles"],
    queryFn: async () => {
      const res = await getAllChildTaskBundlesService(token!);
      return res.data;
    },
    enabled: !!token,
  });

  // Fetch children for multi-select
  const {
    data: childrenResponse,
    isLoading: childrenLoading,
  } = useQuery({
    queryKey: ["childrenForAssignments"],
    queryFn: async () => {
      const res = await getAllChildrenService(token!);
      return res.data;
    },
    enabled: !!token,
  });

  // Fetch assignments (list)
  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
  } = useQuery({
    queryKey: ["childBundleAssignments"],
    queryFn: async () => {
      const res = await getAllChildBundleAssignmentsService(token!);
      return res.data;
    },
    enabled: !!token,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: (data: AddChildBundleAssignmentFormData) =>
      addChildBundleAssignmentService(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childBundleAssignments"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChildBundleAssignmentFormData }) =>
      updateChildBundleAssignmentService(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childBundleAssignments"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChildBundleAssignmentService(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childBundleAssignments"] });
    },
  });

  const openAddModal = useCallback(() => {
    setEditingAssignment(null);
    setForm({ bundleId: "", childIds: [] });
    setModalVisible(true);
    setTimeout(() => searchInputRef.current?.focus(), 200);
  }, []);

  const openEditModal = useCallback((assignment: any) => {
    const selectedChildIds = (assignment.children || []).map((c: Child) => c.id);
    setEditingAssignment(assignment);
    setForm({ bundleId: assignment.bundleId, childIds: selectedChildIds });
    setModalVisible(true);
    setTimeout(() => searchInputRef.current?.focus(), 200);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingAssignment(null);
    setForm({ bundleId: "", childIds: [] });
    setBundleDropdownOpen(false);
    setChildrenDropdownSearch("");
  }, []);

  const toggleChildSelection = useCallback(
    (childId: string) => {
      setForm((prev) => {
        const exists = prev.childIds.includes(childId);
        return {
          ...prev,
          childIds: exists ? prev.childIds.filter((id) => id !== childId) : [...prev.childIds, childId],
        };
      });
    },
    [setForm]
  );

  const handleSave = useCallback(() => {
    if (!form.bundleId?.trim()) {
      Alert.alert("Choose bundle", "Please select a bundle.");
      return;
    }
    if (!form.childIds || form.childIds.length === 0) {
      Alert.alert("Choose children", "Please select at least one child.");
      return;
    }

    if (editingAssignment) {
      updateMutation.mutate({ id: editingAssignment.id, data: { childIds: form.childIds } });
    } else {
      addMutation.mutate(form);
    }
  }, [form, editingAssignment, addMutation, updateMutation]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete Assignment", "Are you sure you want to delete this assignment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  }, []);

  const isMutating =
    addMutation.status === "pending" ||
    updateMutation.status === "pending" ||
    deleteMutation.status === "pending";

  const bundles = bundlesResponse ?? [];
  const children = childrenResponse ?? [];

  const filteredChildren = useMemo(() => {
    if (!children || !children.length) return [];
    if (!childrenDropdownSearch.trim()) return children;
    const q = childrenDropdownSearch.toLowerCase();
    return children.filter((c) => c.name.toLowerCase().includes(q));
  }, [children, childrenDropdownSearch]);

  const renderAssignmentItem = ({ item, index }: { item: any; index: number }) => {
    const assignedChildren: Child[] = item.children ?? [];

    return (
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
          <View className="flex-1">
            <Text className={`text-xl font-semibold ${theme.cardNameColor}`}>
              Bundle
            </Text>
            <Text className={`text-sm ${theme.subTextColor} mt-1`}>
              {assignedChildren.length} child(ren)
            </Text>
          </View>

          <Pressable onPress={() => openEditModal(item)} className="mr-3">
            <Ionicons name="create-outline" size={22} color={theme.iconColor} />
          </Pressable>

          <Pressable onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap">
          {assignedChildren.map((c) => (
            <View
              key={c.id}
              className={`px-3 py-2 rounded-2xl mr-2 mb-2 flex-row items-center ${theme.cardBgColor}`}
              style={{ 
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-2"
                style={{ backgroundColor: c.color }}
              >
                <Text className="text-white font-bold">{c.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text className={`font-medium ${theme.cardNameColor}`}>{c.name}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const ListEmptyComponent = (
    <Animated.View entering={FadeIn.delay(300)} className="justify-center items-center mt-16 px-6">
      <Text className="text-6xl mb-3">🧩</Text>
      <Text className={`text-xl font-bold ${theme.emptyTextColor} mb-1`}>No Assignments</Text>
      <Text className={`text-sm ${theme.subTextColor}`}>Create one to get started</Text>
    </Animated.View>
  );

  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      {/* Header */}
      <View className={`${theme.headerBgColor} px-6 pt-16 pb-6 border-b ${theme.headerBorderColor}`}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className={`text-3xl font-bold ${theme.headerTextColor}`}>Bundle Assignments</Text>
            <Text className={`text-sm mt-1 ${theme.subTextColor}`}>Assign bundles to children</Text>
          </View>

          <View className={`${theme.countBgColor} px-4 py-2 rounded-xl`}>
            <Text className={`${theme.countTextColor} font-semibold`}>{assignments?.length ?? 0}</Text>
          </View>
        </View>
      </View>

      {/* List */}
      {assignmentsLoading || bundlesLoading || childrenLoading ? (
        <FlatList
          data={[1, 2, 3]}
          renderItem={({ index }) => <ChildrenManagerSkeleton index={index} />}
          keyExtractor={(i) => i.toString()}
          contentContainerStyle={{ paddingTop: 16 }}
        />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(i: any) => i.id}
          renderItem={renderAssignmentItem}
          contentContainerStyle={{ paddingBottom: 90, paddingTop: 16 }}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}

      {/* Floating Add Button */}
      <Pressable
        onPress={openAddModal}
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
                {editingAssignment ? "Edit Assignment" : "Add Assignment"}
              </Text>
              <Text className={`text-sm ${theme.subTextColor} mt-1`}>
                {editingAssignment ? "Update assigned children" : "Choose bundle and children"}
              </Text>
            </View>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
              {/* Children multi-select */}
              <Text className={`text-sm font-medium mt-5 mb-2 ${theme.labelColor}`}>Select Children</Text>

              <TextInput
                ref={searchInputRef}
                placeholder="Search children..."
                value={childrenDropdownSearch}
                onChangeText={setChildrenDropdownSearch}
                className={`px-4 py-3 rounded-2xl border ${theme.inputBorderColor} ${theme.inputBgColor} ${theme.inputTextColor}`}
                placeholderTextColor={"#9ca3af"}
              />

              <View 
                className={`mt-3 rounded-xl border ${theme.inputBorderColor} ${theme.inputBgColor} p-2`} 
                style={{ maxHeight: 260 }}
              >
                <ScrollView>
                  {filteredChildren.length === 0 ? (
                    <Text className={`text-sm ${theme.subTextColor} p-3`}>No children found</Text>
                  ) : (
                    filteredChildren.map((c: Child) => {
                      const selected = form.childIds.includes(c.id);
                      return (
                        <Pressable
                          key={c.id}
                          onPress={() => toggleChildSelection(c.id)}
                          className="flex-row items-center px-3 py-3"
                        >
                          <View
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: c.color }}
                          >
                            <Text className="text-white font-bold">{c.name.charAt(0).toUpperCase()}</Text>
                          </View>

                          <View className="flex-1">
                            <Text className={`font-medium ${theme.cardNameColor}`}>{c.name}</Text>
                          </View>

                          <View
                            className={`w-8 h-8 rounded-xl items-center justify-center`}
                            style={{
                              backgroundColor: selected ? theme.accentColor : "transparent",
                              borderWidth: selected ? 0 : 1,
                              borderColor: isDark ? "#4b5563" : "#d1d5db",
                            }}
                          >
                            {selected && <Ionicons name="checkmark" size={18} color={isDark ? "white" : "black"} />}
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
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
                    {editingAssignment ? "Update Assignment" : "Create Assignment"}
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