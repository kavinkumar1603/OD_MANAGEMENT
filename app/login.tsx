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

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const [emailOrRollNo, setEmailOrRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        // Attempt to lookup email by Roll No
        const rollNoRef = doc(db, "rollNo_lookup", emailToUse);
        const rollNoSnap = await getDoc(rollNoRef);

        if (rollNoSnap.exists()) {
          emailToUse = rollNoSnap.data().email;
        } else {
          console.warn("Roll No lookup failed or document does not exist");
        }
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);

      // Simple routing check - in a real app, query user role from Firestore
      if (emailToUse.includes("admin")) {
        router.replace("/admin");
      } else {
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
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.content}>
          {/* Decorative Elements */}
          <View style={styles.decorativeTop} />
          <View style={styles.decorativeBottom} />

          <View style={styles.loginCard}>
            {/* Branding */}
            <View style={styles.brandingContainer}>
              <Text style={styles.brandText}>
                OD <Text style={styles.brandAccent}>Approval</Text>
              </Text>
              <Text style={styles.brandTagline}>for Students</Text>
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in with Email or Roll No</Text>
            </View>

            {/* User ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>User ID / Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailOrRollNo ? styles.inputWrapperFocused : null,
                ]}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="person" size={18} color="#64748b" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Roll No (e.g. 24CS001)"
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
                  password ? styles.inputWrapperFocused : null,
                ]}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="lock-closed" size={18} color="#64748b" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
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
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
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
  },
  decorativeTop: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    backgroundColor: "#eff6ff",
    borderRadius: 100,
  },
  decorativeBottom: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 150,
    height: 150,
    backgroundColor: "#f1f5f9",
    borderRadius: 75,
  },
  loginCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  brandingContainer: {
    marginBottom: 32,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: "#3b82f6",
  },
  brandTagline: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  welcomeContainer: {
    marginBottom: 32,
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
    transition: "all 0.2s",
  },
  inputWrapperFocused: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
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
