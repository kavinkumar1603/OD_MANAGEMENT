import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ODS } from "../constants/mock-data";

export default function ApprovalsScreen() {
  const router = useRouter();
  
  // Filter for Pending or recently approved/rejected to show tracking
  const approvalItems = MOCK_ODS.filter(od => od.status !== "Rejected");

  const renderApprovalStep = (flow: any[], index: number) => {
    if (!flow) return null;
    
    return (
      <View style={styles.flowContainer}>
        {flow.map((step: any, stepIndex: number) => (
          <View key={stepIndex} style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <View 
                style={[
                  styles.dot, 
                  step.status === "Approved" ? styles.dotApproved : 
                  step.status === "Pending" ? styles.dotPending : styles.dotRejected
                ]} 
              >
                {step.status === "Approved" && <Ionicons name="checkmark" size={10} color="#fff" />}
              </View>
              {stepIndex < flow.length - 1 && (
                <View style={[
                  styles.line,
                  flow[stepIndex+1].status !== "Pending" && styles.lineActive
                ]} />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepRole}>{step.role}</Text>
              <View style={styles.stepStatusRow}>
                <Text style={[
                  styles.stepStatus,
                  step.status === "Approved" ? styles.textApproved : 
                  step.status === "Pending" ? styles.textPending : styles.textRejected
                ]}>
                  {step.status}
                </Text>
                {step.date && <Text style={styles.stepDate}>{step.date}</Text>}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
            <Text style={styles.eventTitle}>{item.eventTitle}</Text>
            <Text style={styles.odId}>OD ID: #{item.id}</Text>
        </View>
        <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === "Approved" ? "#dcfce7" : "#fff7ed" }
        ]}>
            <Text style={[
                styles.statusText,
                { color: item.status === "Approved" ? "#166534" : "#c2410c" }
            ]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.flowTitle}>Approval Status</Text>
      {item.approvalFlow ? (
        renderApprovalStep(item.approvalFlow, 0)
      ) : (
        <Text style={styles.noFlowText}>Approval flow details not available</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approval Status</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={approvalItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  odId: {
    fontSize: 12,
    color: "#64748b",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  flowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },
  flowContainer: {
    paddingLeft: 8,
  },
  stepRow: {
    flexDirection: "row",
    height: 60, // Fixed height for vertical alignment
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
    width: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  dotApproved: {
    borderColor: "#22c55e",
    backgroundColor: "#22c55e",
  },
  dotPending: {
    borderColor: "#fbbf24",
    backgroundColor: "#fff",
  },
  dotRejected: {
    borderColor: "#ef4444",
    backgroundColor: "#ef4444",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },
  lineActive: {
    backgroundColor: "#22c55e",
  },
  stepContent: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 0, 
  },
  stepRole: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  stepStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  stepStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  stepDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  textApproved: { color: "#166534" },
  textPending: { color: "#b45309" },
  textRejected: { color: "#991b1b" },
  noFlowText: {
    fontSize: 13,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});
