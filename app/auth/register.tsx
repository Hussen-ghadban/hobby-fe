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
      router.replace("/auth/login");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center py-12">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Fill in your details to get started
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
              {/* Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name
                </Text>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </Text>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                  value={form.email}
                  onChangeText={(t) => setForm({ ...form, email: t })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password */}
              <View className="mb-5">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    placeholder="Create a password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 text-gray-900 dark:text-white"
                    value={form.password}
                    onChangeText={(t) => setForm({ ...form, password: t })}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Text className="text-base">
                      {showPassword ? "🙈" : "👁️"}
                    </Text>
                  </Pressable>
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
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
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}