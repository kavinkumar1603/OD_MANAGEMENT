import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../configs/firebase";

const { height, width } = Dimensions.get("window");

export default function LoginScreen() {
  const [isStudent, setIsStudent] = useState(true); // Toggle state
  const [emailOrRollNo, setEmailOrRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const themeColor = isStudent ? "#3b82f6" : "#8b5cf6"; // Blue for Student, Purple for Admin

  const handleLogin = async () => {
    if (!emailOrRollNo || !password) {
      Alert.alert("Error", "Please enter both User ID and Password");
      return;
    }

    setIsLoading(true);
    try {
      let emailToUse = emailOrRollNo.trim();

      // Check if input is a Roll Number (no @ symbol)
      if (!emailToUse.includes("@")) {
        // Attempt to lookup email by Roll No / Staff ID
        const rollNoRef = doc(db, "rollNo_lookup", emailToUse);
        const rollNoSnap = await getDoc(rollNoRef);

        if (rollNoSnap.exists()) {
          emailToUse = rollNoSnap.data().email;
        } else {
          console.warn("Roll No lookup failed or document does not exist");
        }
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password,
      );
      const uid = userCredential.user.uid;

      // Check user role from Firestore
      const adminDoc = await getDoc(doc(db, "admins", uid));

      if (adminDoc.exists()) {
        if (isStudent) {
          Alert.alert("Admin Detected", "Redirecting to Admin Dashboard...", [
            { text: "OK", onPress: () => router.replace("/admin") },
          ]);
          return;
        }
        router.replace("/admin");
      } else {
        if (!isStudent) {
          Alert.alert(
            "Access Denied",
            "Student accounts are not authorized for Admin access.",
            [
              {
                text: "OK",
                onPress: async () => {
                  await auth.signOut();
                  setIsLoading(false);
                },
              },
            ],
          );
          return;
        }
        router.replace("/home");
      }
    } catch (error: any) {
      console.error(error);
      let msg = "Something went wrong";
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        msg = "Invalid User ID or Password";
      } else if (error.code === "permission-denied") {
        msg = "Access denied. Try logging in with Email instead of Roll No.";
      } else {
        msg = error.message;
      }
      Alert.alert("Login Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isStudent ? "dark" : "light"} />

      {/* Background Decor */}
      <View
        style={[
          styles.bgCircle,
          {
            backgroundColor: isStudent ? "#eff6ff" : "#f3e8ff",
            top: -100,
            right: -50,
          },
        ]}
      />
      <View
        style={[
          styles.bgCircle,
          {
            backgroundColor: isStudent ? "#f1f5f9" : "#f5f3ff",
            bottom: -50,
            left: -50,
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.content}>
          {/* Role Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isStudent && styles.toggleButtonActive,
              ]}
              onPress={() => setIsStudent(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  isStudent && styles.toggleTextActive,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isStudent && { backgroundColor: "#8b5cf6" },
              ]}
              onPress={() => setIsStudent(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  !isStudent && styles.toggleTextActive,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[styles.loginCard, !isStudent && { shadowColor: "#8b5cf6" }]}
          >
            {/* Branding */}
            <View style={styles.brandingContainer}>
              <Text style={styles.brandText}>
                OD <Text style={{ color: themeColor }}>Approval</Text>
              </Text>
              <Text style={styles.brandTagline}>
                {isStudent ? "Student Portal" : "Faculty & Admin Portal"}
              </Text>
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                {isStudent
                  ? "Enter your Roll Number to continue"
                  : "Please enter your Staff ID to proceed"}
              </Text>
            </View>

            {/* User ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {isStudent ? "Roll Number" : "Staff ID"}
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailOrRollNo
                    ? {
                        borderColor: themeColor,
                        backgroundColor: isStudent ? "#eff6ff" : "#f5f3ff",
                      }
                    : null,
                ]}
              >
                <View style={styles.iconBox}>
                  <Ionicons
                    name={
                      isStudent ? "school-outline" : "shield-checkmark-outline"
                    }
                    size={20}
                    color={themeColor}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={isStudent ? "e.g. 24CS001" : "e.g. STAFF001"}
                  placeholderTextColor="#94a3b8"
                  value={emailOrRollNo}
                  onChangeText={setEmailOrRollNo}
                  autoCapitalize="none"
                  autoComplete="username"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  password
                    ? {
                        borderColor: themeColor,
                        backgroundColor: isStudent ? "#eff6ff" : "#f5f3ff",
                      }
                    : null,
                ]}
              >
                <View style={styles.iconBox}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={themeColor}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: themeColor }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: themeColor, shadowColor: themeColor },
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>
                    {isStudent ? "Login as Student" : "Login as Admin"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    minHeight: height,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    position: "relative",
    alignItems: "center",
    width: "100%",
  },
  bgCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    width: "100%",
    maxWidth: 320,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  toggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  toggleTextActive: {
    color: "#0f172a",
    fontWeight: "700",
  },
  loginCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#3b82f6", // Default shadow color
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  brandingContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  iconBox: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
