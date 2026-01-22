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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password required");
      return;
    }

    try {
      const res = await API.post("/api/user/auth/signin", {
        email,
        password,
      });

      if (res.data.status === "success") {
        // ✅ Save token
        await AsyncStorage.setItem("token", res.data.token);

        console.log("TOKEN SAVED");

        // ✅ Redirect to tabs
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login Failed", res.data.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.log("LOGIN ERROR:", error?.message);
      Alert.alert("Login Failed", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookMitra Login</Text>

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
        placeholder="Password"
        placeholderTextColor="#6b7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>New user? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb", // ✅ light background
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
    backgroundColor: "#4f46e5",
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

  forgot: {
    textAlign: "center",
    marginTop: 12,
    color: "#ef4444",
  },

  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#4f46e5",
    fontWeight: "500",
  },
});
