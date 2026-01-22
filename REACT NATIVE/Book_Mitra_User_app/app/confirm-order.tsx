
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

const BASE_URL = "http://10.127.12.103:4000";

export default function ConfirmOrder() {
  const router = useRouter();
  const { addressId } = useLocalSearchParams<{ addressId?: string }>();

  const [loading, setLoading] = useState(false);

  /* ================= VALIDATE ADDRESS ================= */
  useEffect(() => {
    if (!addressId) {
      Alert.alert("Error", "Address not selected");
      router.back();
    }
  }, [addressId]);

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!addressId) {
      Alert.alert("Error", "Address not selected");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: Number(addressId),
        }),
      });

      const json = await res.json();

      if (json.status === "error") {
        Alert.alert("Error", json.error || "Failed to place order");
        return;
      }

      Alert.alert(
        "Order Placed 🛒",
        "Your order has been placed successfully.\nCurrent status: Pending ⏳\n\nYou can track or cancel this order from My Orders.",
        [
          {
            text: "View Orders",
            onPress: () => router.replace("/(tabs)/orders"),
          },
        ]
      );
    } catch (err) {
      Alert.alert("Error", "Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🧾 Confirm Order</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Selected Address ID</Text>
        <Text style={styles.value}>#{addressId}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.value}>Cash on Delivery</Text>
      </View>

      <TouchableOpacity
        style={styles.placeBtn}
        onPress={placeOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  placeBtn: {
    marginTop: 20,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  placeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
