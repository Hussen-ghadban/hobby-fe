import { useTheme } from "@/context/ThemeContext";
import { RootState } from "@/redux/store/rootReducer";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useSelector } from "react-redux";

import {
  AddTemplateChildFormData,
  TemplateChild,
} from "@/types/templateChild.types";

import {
  addTemplateChildService,
  deleteTemplateChildService,
  getAllTemplateChildService,
  updateTemplateChildService,
} from "@/services/templateChild.service";

import { TemplateChildSkeleton } from "@/components/skeletons/TemplateChildSkeleton";
import { getAllChildrenService } from "@/services/child.services";
import { getAllTaskTemplatesService } from "@/services/taskTemplate.service";
import { getTheme } from "@/theme/theme";
import { Child } from "@/types/child.types";
import { TaskTemplate } from "@/types/taskTemplate.types";
import { Ionicons } from "@expo/vector-icons";

export default function TemplateChildScreen() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [data, setData] = useState<TemplateChild[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [children, setChildren] = useState<Child[]>([]);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchChild, setSearchChild] = useState("");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showChildDropdown, setShowChildDropdown] = useState(false);

  const [form, setForm] = useState<AddTemplateChildFormData>({
    templateId: "",
    childId: "",
  });

  const [editing, setEditing] = useState<TemplateChild | null>(null);

  // Fetch all template-child mappings
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllTemplateChildService(token!);
      setData(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load template assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await getAllTaskTemplatesService(token!);
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load templates");
    }
  };

  const fetchChildren = async () => {
    try {
      const res = await getAllChildrenService(token!);
      setChildren(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load children");
    }
  };

  useEffect(() => {
    fetchData();
    fetchTemplates();
    fetchChildren();
  }, []);

  const handleSave = async () => {
    if (!form.templateId || !form.childId) {
      Alert.alert("Validation Error", "Please select both a template and a child");
      return;
    }

    // Check for duplicate assignment (only when creating new, not editing)
    if (!editing) {
      const duplicate = data.find(
        item => item.templateId === form.templateId && item.childId === form.childId
      );
      
      if (duplicate) {
        const template = templates.find(t => t.id === form.templateId);
        const child = children.find(c => c.id === form.childId);
        
        Alert.alert(
          "Duplicate Assignment", 
          `The template "${template?.name}" is already assigned to "${child?.name}".`
        );
        return;
      }
    }

    // Check if updating to a duplicate (different from current assignment)
    if (editing) {
      const duplicate = data.find(
        item => item.id !== editing.id && 
                item.templateId === form.templateId && 
                item.childId === form.childId
      );
      
      if (duplicate) {
        const template = templates.find(t => t.id === form.templateId);
        const child = children.find(c => c.id === form.childId);
        
        Alert.alert(
          "Duplicate Assignment", 
          `The template "${template?.name}" is already assigned to "${child?.name}".`
        );
        return;
      }
    }

    try {
      setLoading(true);

      if (editing) {
        await updateTemplateChildService(editing.id, form, token!);
      } else {
        await addTemplateChildService(form, token!);
      }

      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TemplateChild) => {
    setEditing(item);
    setForm({
      templateId: item.templateId,
      childId: item.childId,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Assignment", "Are you sure you want to remove this template assignment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteTemplateChildService(id, token!);
            fetchData();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete assignment");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditing(null);
    setForm({
      templateId: "",
      childId: "",
    });
    setSearchTemplate("");
    setSearchChild("");
    setShowTemplateDropdown(false);
    setShowChildDropdown(false);
  };

  // Filter templates and children for search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTemplate.toLowerCase())
  );

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchChild.toLowerCase())
  );

  const getChildColor = (childId: string) => {
    const child = children.find(c => c.id === childId);
    return child?.color || '#94a3b8';
  };

  const getSelectedTemplate = () => {
    return templates.find(t => t.id === form.templateId);
  };

  const getSelectedChild = () => {
    return children.find(c => c.id === form.childId);
  };

  const handleTemplateSelect = (template: TaskTemplate) => {
    setForm({ ...form, templateId: template.id });
    setShowTemplateDropdown(false);
    setSearchTemplate("");
  };

  const handleChildSelect = (child: Child) => {
    setForm({ ...form, childId: child.id });
    setShowChildDropdown(false);
    setSearchChild("");
  };

  const clearTemplate = () => {
    setForm({ ...form, templateId: "" });
    setSearchTemplate("");
  };

  const clearChild = () => {
    setForm({ ...form, childId: "" });
    setSearchChild("");
  };

  const renderAssignmentItem = ({ item, index }: { item: TemplateChild; index: number }) => {
    const template = item.template;
    const child = item.child;

    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).springify()}
        layout={Layout.springify()}
        className={`${theme.cardBgColor} rounded-2xl p-5 mb-4 mx-4 border ${theme.cardBorderColor}`}
      >
        <View className="flex-row items-start mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-3">
              <View className={`w-2 h-2 ${isDark ? "bg-purple-400" : "bg-purple-500"} rounded-full mr-2`} />
              <Text className={`text-lg font-bold ${theme.headerTextColor}`}>
                {template?.name || "Unknown Template"}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: getChildColor(item.childId) }}
              >
                <Text className="text-white text-sm font-bold">
                  {child?.name?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
              <Text className={`text-base font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {child?.name || "Unknown Child"}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Pressable
            className={`flex-1 px-4 py-3 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            } border ${isDark ? "border-gray-600" : "border-gray-300"}`}
            onPress={() => handleEdit(item)}
          >
            <Text className={`font-semibold text-center ${theme.headerTextColor}`}>
              Edit
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 px-4 py-3 rounded-lg border ${
              isDark 
                ? "bg-red-900/20 border-red-800" 
                : "bg-red-50 border-red-200"
            }`}
            onPress={() => handleDelete(item.id)}
          >
            <Text className={`font-semibold text-center ${isDark ? "text-red-400" : "text-red-600"}`}>
              Remove
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  // Icon replacements using text/emoji
  const SearchIcon = () => <Text className={theme.subTextColor}>🔍</Text>;
  const ChevronDownIcon = () => <Text className={theme.subTextColor}>⌄</Text>;
  const CloseIcon = () => <Text className={theme.subTextColor}>×</Text>;

  const renderHeader = () => (
    <View className={`${theme.headerBgColor} px-6 pt-16 pb-6  ${theme.headerBorderColor}`}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className={`text-3xl font-bold ${theme.headerTextColor} mb-2`}>
            Template Assignments
          </Text>
          <Text className={`${theme.subTextColor} text-sm`}>
            Assign task templates to children
          </Text>
        </View>
        <View className={`${theme.countBgColor} px-4 py-2 rounded-lg`}>
          <Text className={`${theme.countTextColor} font-semibold`}>
            {data.length}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${theme.bgColor}`}>
      <FlatList<TemplateChild | number>
        data={loading && data.length === 0 ? [1, 2, 3, 4, 5] : data}
        keyExtractor={(item, index) => (typeof item === "number" ? `skeleton-${item}-${index}` : item.id)}
        renderItem={({ item, index }) => {
          if (loading && data.length === 0) {
            return <TemplateChildSkeleton index={index} />;
          }

          return renderAssignmentItem({ item: item as TemplateChild, index });
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() =>
          !loading ? (
            <Animated.View entering={FadeIn.delay(500)} className="flex-1 justify-center items-center px-8 mt-10">
              <View className={`w-24 h-24 ${theme.emptyIconBgColor} rounded-full items-center justify-center mb-6`}>
                <Text className="text-5xl">📋</Text>
              </View>
              <Text className={`text-xl font-bold ${theme.headerTextColor} mb-3 text-center`}>
                No Assignments Yet
              </Text>
              <Text className={`text-center ${theme.subTextColor} mb-6`}>
                Start by assigning your first task template to a child
              </Text>
            </Animated.View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
<Pressable
  onPress={() => setModalVisible(true)}
  className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center ${theme.fabBgColor}`}
  style={{ zIndex: 1000 }}
>
  <Ionicons name="add" size={32} color={theme.fabTextColor} />
</Pressable>


      {/* Enhanced Modal with Dropdowns */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        avoidKeyboard={true}
      >
        <View className={`${theme.modalBgColor} rounded-t-3xl flex-1`} style={{ maxHeight: '85%' }}>
          {/* Modal Handle */}
          <View className="items-center py-3">
            <View className={`w-12 h-1 ${theme.handleBarColor} rounded-full`} />
          </View>

          {/* Modal Header */}
          <View className={`px-6 py-5  ${theme.modalHeaderBorderColor}`}>
            <Text className={`text-2xl font-bold ${theme.headerTextColor} mb-1`}>
              {editing ? "Update Assignment" : "Assign Template"}
            </Text>
            <Text className={`${theme.subTextColor}`}>
              {editing ? "Modify template assignment" : "Select template and child"}
            </Text>
          </View>

          <ScrollView 
            className="flex-1 px-6 py-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Template Dropdown */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-3`}>
                Select Template
              </Text>
              
              <Pressable
                className={`rounded-lg p-4 flex-row items-center justify-between ${
                  form.templateId 
                    ? isDark
                      ? "bg-purple-900/20 border-purple-400"
                      : "bg-purple-50 border-purple-500"
                    : `${theme.inputBgColor} ${theme.inputBorderColor}`
                }`}
                onPress={() => setShowTemplateDropdown(!showTemplateDropdown)}
              >
                <View className="flex-1">
                  {form.templateId ? (
                    <View>
                      <Text className={`font-semibold ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                        {getSelectedTemplate()?.name}
                      </Text>
                      <Text className={`text-sm mt-1 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                        Selected Template
                      </Text>
                    </View>
                  ) : (
                    <Text className={theme.subTextColor}>
                      Choose a template...
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  {form.templateId && (
                    <Pressable onPress={clearTemplate} className="p-1">
                      <CloseIcon />
                    </Pressable>
                  )}
                  <ChevronDownIcon />
                </View>
              </Pressable>

              {/* Template Dropdown List */}
              {showTemplateDropdown && (
                <Animated.View 
                  entering={FadeIn}
                  className={`mt-2 border ${theme.cardBorderColor} rounded-lg pb-2 ${theme.cardBgColor}`}
                  style={{ maxHeight: 192 }}
                >
                  {/* Search Bar */}
                  <View className={`p-3 ${theme.cardBorderColor}`}>
                    <View className={`flex-row items-center ${theme.dropdownBgColor} rounded-lg px-3 py-2`}>
                      <SearchIcon />
                      <TextInput
                        placeholder="Search templates..."
                        placeholderTextColor="#9ca3af"
                        className={`flex-1 ${theme.inputTextColor} ml-2`}
                        value={searchTemplate}
                        onChangeText={setSearchTemplate}
                      />
                    </View>
                  </View>

                  {/* Template List */}
                  <ScrollView
                    style={{ maxHeight: 128 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredTemplates.length === 0 ? (
                      <View className="p-4 items-center">
                        <Text className={theme.subTextColor}>
                          No templates found
                        </Text>
                      </View>
                    ) : (
                      filteredTemplates.map((template) => (
                        <Pressable
                          key={template.id}
                          className={`p-4 ${theme.cardBorderColor} ${
                            form.templateId === template.id
                              ? isDark ? "bg-purple-900/20" : "bg-purple-50"
                              : theme.cardBgColor
                          }`}
                          onPress={() => handleTemplateSelect(template)}
                        >
                          <Text className={`font-medium ${
                            form.templateId === template.id
                              ? isDark ? "text-purple-300" : "text-purple-700"
                              : theme.headerTextColor
                          }`}>
                            {template.name}
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                </Animated.View>
              )}
            </View>

            {/* Child Dropdown */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold ${theme.labelColor} mb-3`}>
                Select Child
              </Text>
              
              <Pressable
                className={`rounded-lg p-4 flex-row items-center justify-between ${
                  form.childId 
                    ? isDark
                      ? "bg-green-900/20 border-green-400"
                      : "bg-green-50 border-green-500"
                    : `${theme.inputBgColor} ${theme.inputBorderColor}`
                }`}
                onPress={() => setShowChildDropdown(!showChildDropdown)}
              >
                <View className="flex-1 flex-row items-center">
                  {form.childId ? (
                    <>
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: getSelectedChild()?.color || '#94a3b8' }}
                      >
                        <Text className="text-white font-bold text-sm">
                          {getSelectedChild()?.name?.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text className={`font-semibold ${isDark ? "text-green-300" : "text-green-700"}`}>
                          {getSelectedChild()?.name}
                        </Text>
                        <Text className={`text-sm ${isDark ? "text-green-400" : "text-green-600"}`}>
                          Selected Child
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text className={theme.subTextColor}>
                      Choose a child...
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  {form.childId && (
                    <Pressable onPress={clearChild} className="p-1">
                      <CloseIcon />
                    </Pressable>
                  )}
                  <ChevronDownIcon />
                </View>
              </Pressable>

              {/* Child Dropdown List */}
              {showChildDropdown && (
                <Animated.View 
                  entering={FadeIn}
                  className={`mt-2 border ${theme.cardBorderColor} rounded-lg pb-2 ${theme.cardBgColor}`}
                  style={{ maxHeight: 192 }}
                >
                  {/* Search Bar */}
                  <View className={`p-3 ${theme.cardBorderColor}`}>
                    <View className={`flex-row items-center ${theme.dropdownBgColor} rounded-lg px-3 py-2`}>
                      <SearchIcon />
                      <TextInput
                        placeholder="Search children..."
                        placeholderTextColor="#9ca3af"
                        className={`flex-1 ${theme.inputTextColor} ml-2`}
                        value={searchChild}
                        onChangeText={setSearchChild}
                      />
                    </View>
                  </View>

                  {/* Children List */}
                  <ScrollView
                    style={{ maxHeight: 128 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredChildren.length === 0 ? (
                      <View className="p-4 items-center">
                        <Text className={theme.subTextColor}>
                          No children found
                        </Text>
                      </View>
                    ) : (
                      filteredChildren.map((child) => (
                        <Pressable
                          key={child.id}
                          className={`p-4 ${theme.cardBorderColor} flex-row items-center ${
                            form.childId === child.id
                              ? isDark ? "bg-green-900/20" : "bg-green-50"
                              : theme.cardBgColor
                          }`}
                          onPress={() => handleChildSelect(child)}
                        >
                          <View
                            className="w-8 h-8 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: child.color || '#94a3b8' }}
                          >
                            <Text className="text-white font-bold text-sm">
                              {child.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Text className={`font-medium ${
                            form.childId === child.id
                              ? isDark ? "text-green-300" : "text-green-700"
                              : theme.headerTextColor
                          }`}>
                            {child.name}
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                </Animated.View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mb-4">
              <Pressable
                className={`py-4 rounded-lg ${
                  form.templateId && form.childId
                    ? theme.fabBgColor
                    : isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
                onPress={handleSave}
                disabled={loading || !form.templateId || !form.childId}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#111827" : "white"} />
                ) : (
                  <Text className={`font-semibold text-center ${
                    form.templateId && form.childId
                      ? theme.fabTextColor
                      : theme.subTextColor
                  }`}>
                    {editing ? "Update Assignment" : "Assign Template"}
                  </Text>
                )}
              </Pressable>

              <Pressable
                className={`${isDark ? "bg-gray-700" : "bg-gray-200"} py-4 rounded-lg border ${theme.cardBorderColor}`}
                onPress={closeModal}
                disabled={loading}
              >
                <Text className={`font-semibold text-center ${theme.headerTextColor}`}>
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