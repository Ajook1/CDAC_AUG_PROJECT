

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const BASE_URL = "http://10.127.12.103:4000";

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (json.status === "error") {
        throw new Error("Session expired");
      }

      setProfile(json.data);
    } catch {
      Alert.alert("Session Expired", "Please login again");
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
        }),
      });

      const json = await res.json();

      if (json.status === "error") {
        Alert.alert("Error", json.error);
        return;
      }

      Alert.alert("Success", "Profile updated successfully ✅");
    } catch {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      Alert.alert("Error", "All password fields are required");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/user/profile/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const json = await res.json();

      if (json.status === "error") {
        Alert.alert("Error", json.error);
        return;
      }

      Alert.alert("Success", "Password changed successfully 🔐");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      Alert.alert("Error", "Password change failed");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            router.replace("/login");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👤 My Profile</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "profile" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("profile")}
        >
          <Text style={styles.tabText}>Profile Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "password" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("password")}
        >
          <Text style={styles.tabText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE INFO */}
      {activeTab === "profile" && (
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={profile.name}
            onChangeText={(t) => setProfile({ ...profile, name: t })}
          />

          <TextInput
            style={[styles.input, styles.disabled]}
            value={profile.email}
            editable={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="number-pad"
            value={profile.phone}
            onChangeText={(t) => setProfile({ ...profile, phone: t })}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={updateProfile}>
            <Text style={styles.btnText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CHANGE PASSWORD */}
      {activeTab === "password" && (
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            secureTextEntry
            value={passwords.oldPassword}
            onChangeText={(t) =>
              setPasswords({ ...passwords, oldPassword: t })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={passwords.newPassword}
            onChangeText={(t) =>
              setPasswords({ ...passwords, newPassword: t })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={passwords.confirmPassword}
            onChangeText={(t) =>
              setPasswords({ ...passwords, confirmPassword: t })
            }
          />

          <TouchableOpacity style={styles.warningBtn} onPress={changePassword}>
            <Text style={styles.btnText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🔴 LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#4f46e5",
  },
  tabText: {
    color: "#111827",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  disabled: {
    backgroundColor: "#e5e7eb",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  warningBtn: {
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
