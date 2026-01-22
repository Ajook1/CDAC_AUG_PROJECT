

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const BASE_URL = "http://10.127.12.103:4000/api/user/address";

interface Address {
  address_id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export default function Addresses() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  /* ================= FETCH ================= */
  const fetchAddresses = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.status === "error") {
        Alert.alert("Error", json.error);
        return;
      }

      setAddresses(json.data || []);
    } catch {
      Alert.alert("Error", "Failed to load addresses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddresses();
  };

  /* ================= ADD ================= */
  const saveAddress = async () => {
    const { full_name, phone, address_line, city, state, postal_code, country } =
      form;

    if (
      !full_name ||
      !phone ||
      !address_line ||
      !city ||
      !state ||
      !postal_code ||
      !country
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.status === "error") {
        Alert.alert("Error", json.error);
        return;
      }

      Alert.alert("Success", "Address added");
      setShowAddForm(false);
      setForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
      fetchAddresses();
    } catch {
      Alert.alert("Error", "Failed to save address");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>📍 Select Address</Text>

        {addresses.map((addr) => (
          <View key={addr.address_id} style={styles.card}>
            <Text style={styles.name}>{addr.full_name}</Text>
            <Text>{addr.phone}</Text>
            <Text>{addr.address_line}</Text>
            <Text>
              {addr.city}, {addr.state} - {addr.postal_code}
            </Text>
            <Text>{addr.country}</Text>

            {/* ✅ IMPORTANT FIX */}
            <Pressable
              style={styles.useBtn}
              onPress={() =>
                router.push({
                  pathname: "/confirm-order",
                  params: { addressId: String(addr.address_id) },
                })
              }
            >
              <Text style={styles.useBtnText}>Use this address</Text>
            </Pressable>
          </View>
        ))}

        {!showAddForm && (
          <Pressable style={styles.addBtn} onPress={() => setShowAddForm(true)}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              ➕ Add New Address
            </Text>
          </Pressable>
        )}

        {showAddForm && (
          <View style={styles.form}>
            {Object.entries(form).map(([k, v]) => (
              <TextInput
                key={k}
                placeholder={k.replace("_", " ").toUpperCase()}
                style={styles.input}
                value={v}
                onChangeText={(t) => setForm({ ...form, [k]: t })}
              />
            ))}

            <Pressable style={styles.saveBtn} onPress={saveAddress}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Save Address
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 16 },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { fontWeight: "700", marginBottom: 4 },

  useBtn: {
    marginTop: 10,
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  useBtnText: { color: "#fff", fontWeight: "700" },

  addBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  form: { backgroundColor: "#fff", padding: 14, borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});
