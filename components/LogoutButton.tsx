import React from "react";
import { Pressable, Text, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { logout } from "@/redux/features/auth/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleLogout}
      className="bg-red-500 dark:bg-red-600 rounded-2xl py-4 px-6 active:scale-98 shadow-lg"
    >
      <Text className="text-white text-center text-lg font-bold">
        Logout
      </Text>
    </Pressable>
  );
};

export default LogoutButton;