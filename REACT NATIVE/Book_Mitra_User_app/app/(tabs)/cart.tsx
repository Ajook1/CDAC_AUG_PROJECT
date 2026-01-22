
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";

const BASE_URL = "http://10.127.12.103:4000";

type CartItem = {
  cart_item_id: number;
  inventory_id: number;
  title: string;
  quantity: number;
  price_at_addition: number;
  cover_image_url?: string | null;
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  /* ================= LOAD CART ================= */
  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.status === "error") {
        setItems([]);
        return;
      }

      setItems(json.data || []);
    } catch {
      setItems([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  /* ================= UPDATE QTY ================= */
 const updateQty = async (id: number, qty: number) => {
  if (qty < 1) return;

  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/user/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: qty }),
    });

    const json = await res.json();

    if (json.status === "error") {
      Alert.alert(
        "Out of stock ❌",
        "This book is currently out of stock"
      );
      return;
    }

    loadCart();
  } catch {
    Alert.alert("Error", "Failed to update quantity");
  }
};


  /* ================= REMOVE ================= */
  const removeItem = (id: number) => {
    Alert.alert("Remove item?", "Do you want to remove this book?", [
      { text: "Cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");
          await fetch(`${BASE_URL}/api/user/cart/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          loadCart();
        },
      },
    ]);
  };

  const total = items.reduce(
    (sum, i) => sum + i.price_at_addition * i.quantity,
    0
  );

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.cart_item_id.toString()}
        contentContainerStyle={{ paddingBottom: 160 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Your cart is empty 🛒</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.cover_image_url
                  ? `${BASE_URL}/${item.cover_image_url}`
                  : "https://via.placeholder.com/120x180.png",
              }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>

              <Text style={styles.price}>
                ₹ {item.price_at_addition}
              </Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  disabled={item.quantity === 1}
                  onPress={() =>
                    updateQty(item.cart_item_id, item.quantity - 1)
                  }
                >
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyValue}>
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQty(item.cart_item_id, item.quantity + 1)
                  }
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => removeItem(item.cart_item_id)}
              >
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ===== BOTTOM BAR ===== */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₹ {total}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkout}
          onPress={() => router.push("/addresses")}
        >
          <Text style={styles.checkoutText}>
            Proceed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
    marginVertical: 4,
  },

  /* QTY */
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "700",
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: "700",
  },

  remove: {
    color: "#dc2626",
    fontWeight: "600",
    marginTop: 4,
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  checkout: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});

