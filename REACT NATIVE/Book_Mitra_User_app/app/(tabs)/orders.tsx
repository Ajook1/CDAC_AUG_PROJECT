

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const BASE_URL = "http://10.127.12.103:4000";

type Order = {
  order_id: number;
  status: string;
  total_amount: number;
  order_date: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (json.status === "error") {
        Alert.alert("Error", json.error);
        return;
      }

      // ✅ HIDE CANCELLED ORDERS
      const filtered = (json.data || []).filter(
        (o: Order) => o.status !== "Cancelled"
      );

      setOrders(filtered);
    } catch (e) {
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  /* ================= CANCEL ORDER ================= */
  const cancelOrder = (orderId: number) => {
    Alert.alert(
      "Cancel Order",
      "Do you want to cancel this order?",
      [
        { text: "No" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              const res = await fetch(
                `${BASE_URL}/api/user/orders/${orderId}/cancel`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const json = await res.json();

              if (json.status === "error") {
                Alert.alert("Error", json.error);
                return;
              }

              Alert.alert("Success", "Order cancelled");
              loadOrders(); // refresh list
            } catch {
              Alert.alert("Error", "Cancel failed");
            }
          },
        },
      ]
    );
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No orders yet
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderId}>
                Order #{item.order_id}
              </Text>

              <Text style={styles.date}>
                {new Date(item.order_date).toDateString()}
              </Text>

              <Text style={styles.total}>
                Total: ₹ {item.total_amount}
              </Text>

              <Text
                style={[
                  styles.status,
                  item.status === "Pending" && styles.pending,
                  item.status === "Shipped" && styles.shipped,
                  item.status === "Delivered" && styles.delivered,
                ]}
              >
                {item.status}
              </Text>
            </View>

            {/* ❌ Cancel only if Pending */}
            {item.status === "Pending" && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => cancelOrder(item.order_id)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  orderId: {
    fontWeight: "700",
    fontSize: 15,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
    marginVertical: 2,
  },
  total: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
  },
  pending: {
    color: "#f59e0b",
  },
  shipped: {
    color: "#2563eb",
  },
  delivered: {
    color: "#16a34a",
  },
  cancelBtn: {
    backgroundColor: "#fee2e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelText: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 13,
  },
});
