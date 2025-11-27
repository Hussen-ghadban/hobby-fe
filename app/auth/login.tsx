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
      
      // Navigate with error handling
      try {
        router.replace("/home");
      } catch (navErr) {
        console.error("Navigation error:", navErr);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
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
                <Ionicons name="log-in" size={32} color="#3b82f6" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Sign in to your account
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
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
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 pl-12 pr-12 text-gray-900 dark:text-white w-full"
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
            
            {/* Extra space at bottom for keyboard */}
            <View className="h-40" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}