

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_HEIGHT = 64;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: TAB_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#e5e7eb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "#4f46e5" : "#6b7280"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={focused ? "red" : "#6b7280"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="cart-outline"
              size={24}
              color={focused ? "#4f46e5" : "#6b7280"}
            />
          ),
        }}
      />

          <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="receipt-outline"
              size={26}
              color={focused ? "#4f46e5" : "#6b7280"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={24}
              color={focused ? "#4f46e5" : "#6b7280"}
            />
          ),
        }}
      />
    </Tabs>
  );
}


