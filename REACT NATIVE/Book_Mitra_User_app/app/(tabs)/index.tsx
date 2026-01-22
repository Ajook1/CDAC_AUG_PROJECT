

import {View,Text,FlatList, StyleSheet,Image, TouchableOpacity,TextInput,Dimensions, Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "http://10.127.12.103:4000";
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

type Book = {
  book_id: number;
  title: string;
  price: number;
  inventory_id: number;
  cover_image_url?: string | null;
};

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filtered, setFiltered] = useState<Book[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH BOOKS ================= */
  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/api/user/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: Book[] = res.data.data || [];
      setBooks(data);
      setFiltered(data);
    } catch {
      Alert.alert("Error", "Failed to load books");
    }
  };

  /* ================= FETCH WISHLIST ================= */
  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/api/user/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = (res.data.data || []).map(
        (w: any) => w.inventory_id
      );

      setWishlistIds(ids);
    } catch {}
  };

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
  }, []);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    let data = books;

    if (search.trim()) {
      data = data.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, books]);

  /* ================= WISHLIST TOGGLE ================= */
  const toggleWishlist = async (inventoryId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (wishlistIds.includes(inventoryId)) {
        await API.delete(`/api/user/wishlist/${inventoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlistIds(wishlistIds.filter((id) => id !== inventoryId));
        Alert.alert("Wishlist", "Removed from wishlist");
      } else {
        await API.post(
          "/api/user/wishlist",
          { inventory_id: inventoryId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWishlistIds([...wishlistIds, inventoryId]);
        Alert.alert("Wishlist", "Added to wishlist ❤️");
      }
    } catch {
      Alert.alert("Error", "Wishlist action failed");
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (inventoryId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/api/user/cart",
        { inventory_id: inventoryId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Cart", "Added to cart 🛒");
    } catch {
      Alert.alert("Error", "Unable to add to cart");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 SEARCH */}
      <TextInput
        placeholder="Search books"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* 📚 BOOK LIST */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.inventory_id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const imageUrl = item.cover_image_url
            ? `${BASE_URL}/${item.cover_image_url}`
            : null;

          return (
            <View style={styles.card}>
              {/* ❤️ WISHLIST */}
              <TouchableOpacity
                style={styles.heart}
                onPress={() => toggleWishlist(item.inventory_id)}
              >
                <Ionicons
                  name={
                    wishlistIds.includes(item.inventory_id)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={22}
                  color={
                    wishlistIds.includes(item.inventory_id)
                      ? "red"
                      : "#fff"
                  }
                />
              </TouchableOpacity>

              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholder]}>
                  <Text>📘</Text>
                </View>
              )}

              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.price}>₹ {item.price}</Text>

              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => addToCart(item.inventory_id)}
              >
                <Text style={styles.cartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 10,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    elevation: 3,
  },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    marginBottom: 6,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
    marginVertical: 4,
  },
  cartBtn: {
    backgroundColor: "#4f46e5",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  cartText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
