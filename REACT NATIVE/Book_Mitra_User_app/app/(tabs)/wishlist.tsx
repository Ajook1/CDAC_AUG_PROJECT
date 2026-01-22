

import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.127.12.103:4000";

type WishlistItem = {
  wishlist_id: number;
  inventory_id: number;
  title: string;
  author?: string;
  price: number;
};

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ================= LOAD WISHLIST (ON FOCUS) ================= */
  const loadWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (json.status === "success") {
        setItems(json.data || []);
      } else {
        setItems([]);
      }
    } catch {
      Alert.alert("Error", "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  /* ================= BUY NOW ================= */
  const buyNow = async (inventoryId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inventory_id: inventoryId,
          quantity: 1,
        }),
      });

      const json = await res.json();

      if (json.status === "success") {
        Alert.alert("Cart", "🛒 Added to cart");
        router.push("/cart");
      }
    } catch {
      Alert.alert("Error", "Unable to add to cart");
    }
  };

  /* ================= REMOVE FROM WISHLIST ================= */
  const handleRemove = async (inventoryId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/user/wishlist/${inventoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json.status === "success") {
        setItems((prev) =>
          prev.filter((i) => i.inventory_id !== inventoryId)
        );
        Alert.alert("Wishlist", "🤍 Removed from wishlist");
      }
    } catch {
      Alert.alert("Error", "Failed to remove item");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading wishlist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❤️ My Wishlist</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>
          Your wishlist is empty ❤️
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) =>
            item.inventory_id.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                {item.author && (
                  <Text style={styles.author}>
                    {item.author}
                  </Text>
                )}
                <Text style={styles.price}>
                  ₹ {item.price}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => buyNow(item.inventory_id)}
                >
                  <Text style={styles.buyText}>
                    Buy Now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    handleRemove(item.inventory_id)
                  }
                >
                  <Text style={styles.removeText}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  author: {
    fontSize: 13,
    color: "#6b7280",
    marginVertical: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
    marginTop: 4,
  },
  actions: {
    justifyContent: "space-between",
  },
  buyBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
  buyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  removeText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 13,
  },
});
