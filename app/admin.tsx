import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="settings-outline" size={34} color="#fff" />
          <Text style={styles.headerTitle}>Admin Console</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people-outline" size={28} color="#1e3c72" />
            <Text style={styles.actionText}>Manage Students</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="checkmark-done-outline" size={28} color="#1e3c72" />
            <Text style={styles.actionText}>Approve ODs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="bar-chart-outline" size={28} color="#1e3c72" />
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.note}>
          This is a placeholder admin page. Wire to your backend roles.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { paddingHorizontal: 20, paddingVertical: 24 },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  content: { flex: 1, padding: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: 12,
  },
  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  actionText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  note: { fontSize: 12, color: "#6b7280" },
});
