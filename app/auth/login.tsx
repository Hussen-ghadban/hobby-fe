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
import { router, Link } from "expo-router";
import { useDispatch } from "react-redux";
import { loginService } from "@/services/auth.service";
import { loginSuccess } from "@/redux/features/auth/authSlice";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await loginService(form);
      const user = response.data.user;
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      dispatch(loginSuccess({ user, accessToken, refreshToken }));
      router.replace("/home");
    } catch {
      setError("Invalid credentials. Please try again.");
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
                Welcome Back
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
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
                    placeholder="Enter your password"
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
              </View>

              {/* Error */}
              {error ? (
                <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <Text className="text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                className={`bg-gray-900 dark:bg-white rounded-lg py-3.5 mb-4 ${
                  loading ? "opacity-70" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white dark:text-gray-900 font-semibold text-center">
                    Sign In
                  </Text>
                )}
              </Pressable>

              {/* Sign Up Link */}
              <View className="flex-row justify-center">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Don&apos;t have an account?{" "}
                </Text>
                <Link href="/auth/register" asChild>
                  <Pressable>
                    <Text className="text-gray-900 dark:text-white font-semibold text-sm">
                      Sign Up
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