import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../src/services/api";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert("Error", "All fields required");
      return;
    }

    try {
      const res = await API.post("/api/user/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (res.data.status === "success") {
        Alert.alert("Success", "Password reset successful");
        router.replace("/login");
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Password reset failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.btnText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#22c55e", padding: 14, borderRadius: 8 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
