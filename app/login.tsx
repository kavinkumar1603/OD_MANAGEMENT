import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // TODO: Replace with real authentication against your database
    const isAdmin = userId.toLowerCase().includes("admin");
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/home");
    }
  };

  return (
    <View style={styles.container}>
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
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* User ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>User ID</Text>
              <View
                style={[
                  styles.inputWrapper,
                  userId && styles.inputWrapperFocused,
                ]}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="person" size={18} color="#64748b" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your user ID"
                  placeholderTextColor="#94a3b8"
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  password && styles.inputWrapperFocused,
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
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.signInText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>

            {/* Admin Info */}
            <View style={styles.infoContainer}>
              <Ionicons name="information-circle" size={16} color="#94a3b8" />
              <Text style={styles.infoText}>
                Admins use your admin credentials
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10, // Reduced padding for more width on small screens
    paddingVertical: 40,
    position: "relative",
  },
  decorativeTop: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#eff6ff",
  },
  decorativeBottom: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#f0f9ff",
  },
  loginCard: {
    width: "100%",
    maxWidth: 480, // Increased max-width for wider appearance
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  brandingContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: "#2563eb",
  },
  brandTagline: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  welcomeContainer: {
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
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
    color: "#334155",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  inputWrapperFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "500",
  },
  eyeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  signInText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  infoText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
    zIndex: 1,
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
