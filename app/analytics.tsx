import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ODS } from "../constants/mock-data";

export default function AnalyticsScreen() {
  const router = useRouter();

  const total = MOCK_ODS.length;
  const approved = MOCK_ODS.filter((od) => od.status === "Approved").length;
  const rejected = MOCK_ODS.filter((od) => od.status === "Rejected").length;
  const pending = MOCK_ODS.filter((od) => od.status === "Pending").length;

  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Approval Rate</Text>
          <View style={styles.pieContainer}>
            <View style={styles.pieBackground} />
            <Text style={styles.pieText}>{approvalRate}%</Text>
          </View>
          <Text style={styles.overviewSubtitle}>
            Total Applications: {total}
          </Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownContainer}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#22c55e" }]}>
              {approved}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxBorder]}>
            <Text style={[styles.statValue, { color: "#fbbf24" }]}>
              {pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#ef4444" }]}>
              {rejected}
            </Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Monthly Trend (Static Mock) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Activity</Text>
          <View style={styles.chartContainer}>
            {/* Mock Bars */}
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: 80 }]} />
              <Text style={styles.barLabel}>Mar</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: 60 }]} />
              <Text style={styles.barLabel}>Apr</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: 40 }]} />
              <Text style={styles.barLabel}>May</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: 100 }]} />
              <Text style={styles.barLabel}>Jun</Text>
            </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  content: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 16,
  },
  pieContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  pieBackground: {
    position: "absolute",
    top: -10,
    left: -10,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "#4f46e5",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  pieText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4f46e5",
  },
  overviewSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  breakdownContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#f1f5f9",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 150,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  barGroup: {
    alignItems: "center",
    gap: 8,
  },
  bar: {
    width: 32,
    backgroundColor: "#c7d2fe",
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 12,
    color: "#64748b",
  },
});
