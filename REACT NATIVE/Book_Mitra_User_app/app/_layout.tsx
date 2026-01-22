
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* AUTH SCREENS */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-otp" />

      {/* MAIN APP */}
      <Stack.Screen name="(tabs)" />

      {/* NON-TAB SCREENS */}
      <Stack.Screen name="addresses" />
      <Stack.Screen name="confirm-order" />
    </Stack>
  );
}
