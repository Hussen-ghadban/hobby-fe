import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store/store";
import { RootState } from "@/redux/store/rootReducer";
import { ThemeProvider } from "@/context/ThemeContext";
import "../global.css";

// ⬇️ TanStack Query Setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a single query client instance
const queryClient = new QueryClient();

function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === "auth";

    if (!accessToken && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (accessToken && inAuthGroup) {
      router.replace("/home");
    }
  }, [segments, accessToken, isReady, router]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MainLayout />
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
