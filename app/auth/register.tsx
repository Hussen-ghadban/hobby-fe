import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { RegisterFormData } from "@/types/auth.types";
import { registerService } from "@/services/auth.service";

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterFormData>({
    email: "",
    password: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = async () => {
    if (!agreedToTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerService(form);
      
      // Navigate after a small delay to ensure state is settled
      setTimeout(() => {
        router.replace("/auth/login");
      }, 100);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
          <View className="flex-1 px-6 justify-center py-12">
            {/* Header */}
            <View className="items-center mb-10">
              <View className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-4">
                <Ionicons name="person-add" size={32} color="#3b82f6" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Join us and get started
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
              {/* Name */}
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </Text>
                <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Ionicons name="person" size={18} color="#9ca3af" className="ml-3" />
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 px-4 py-3 text-gray-900 dark:text-white"
                    value={form.name}
                    onChangeText={(t) => setForm({ ...form, name: t })}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Ionicons name="mail" size={18} color="#9ca3af" className="ml-3" />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 px-4 py-3 text-gray-900 dark:text-white"
                    value={form.email}
                    onChangeText={(t) => setForm({ ...form, email: t })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </Text>
                <View className="relative">
                  <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                  </View>
                  <TextInput
                    placeholder="Create a password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 pl-12 pr-12 text-gray-900 dark:text-white"
                    value={form.password}
                    onChangeText={(t) => setForm({ ...form, password: t })}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1"
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#9ca3af"
                    />
                  </Pressable>
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Must be at least 8 characters
                </Text>
              </View>

              {/* Terms */}
              <Pressable
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                className="flex-row items-start mb-5"
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-2.5 mt-0.5 items-center justify-center ${
                    agreedToTerms
                      ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {agreedToTerms && (
                    <Text className={`text-xs ${
                      agreedToTerms ? "text-white dark:text-gray-900" : ""
                    }`}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text className="flex-1 text-xs text-gray-600 dark:text-gray-400 leading-5">
                  I agree to the{" "}
                  <Text className="text-gray-900 dark:text-white font-medium">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text className="text-gray-900 dark:text-white font-medium">
                    Privacy Policy
                  </Text>
                </Text>
              </Pressable>

              {/* Error */}
              {error ? (
                <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <Text className="text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Register Button */}
              <Pressable
                onPress={handleRegister}
                disabled={loading}
                className={`bg-gray-900 dark:bg-white rounded-lg py-3.5 mb-4 ${
                  loading ? "opacity-70" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white dark:text-gray-900 font-semibold text-center">
                    Create Account
                  </Text>
                )}
              </Pressable>

              {/* Login Link */}
              <View className="flex-row justify-center">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Already have an account?{" "}
                </Text>
                <Link href="/auth/login" asChild>
                  <Pressable>
                    <Text className="text-gray-900 dark:text-white font-semibold text-sm">
                      Sign In
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
            
            {/* Extra space at bottom for keyboard */}
            <View className="h-40" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}