import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../src/services/api";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await API.post("/api/user/auth/signup", {
        name,
        email,
        phone,
        password,
      });

      if (res.data.status === "success") {
        Alert.alert("Success", "Signup successful. Please login.");
        router.replace("/login");
      } else {
        Alert.alert("Error", res.data.data || "Signup failed");
      }
    } catch (error: any) {
      console.log("REGISTER ERROR:", error?.message);
      Alert.alert("Error", "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#6b7280"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        placeholderTextColor="#6b7280"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb", 
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,

    backgroundColor: "#ffffff", 
    color: "#000000",           
  },

  button: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#4f46e5",
    fontWeight: "500",
  },
});
