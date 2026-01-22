import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../src/services/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const sendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter email");
      return;
    }

    try {
      const res = await API.post("/api/user/auth/forgot-password", { email });

      if (res.data.status === "success") {
        Alert.alert("Success", "OTP sent to your email");
        router.push({ pathname: "/verify-otp", params: { email } });
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to send OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        placeholder="Enter registered email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={sendOtp}>
        <Text style={styles.btnText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#f59e0b", padding: 14, borderRadius: 8 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
