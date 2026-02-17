import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../configs/firebase";

export default function AdminScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchRequests = async () => {
    try {
      // Fetch Pending Requests
      const q = query(
        collection(db, "od_requests"),
        where("status", "==", "Pending"),
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() });
      });

      // Sort client-side
      fetchedRequests.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      );

      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to load requests.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    Alert.alert(
      "Confirm Approval",
      "Are you sure you want to approve this OD request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "od_requests", id), {
                status: "Approved",
                reviewedAt: new Date().toISOString(),
              });
              Alert.alert("Success", "OD Approved");
              fetchRequests();
            } catch (e) {
              Alert.alert("Error", "Failed to approve OD");
            }
          },
        },
      ],
    );
  };

  const initReject = (id: string) => {
    setSelectedRequestId(id);
    setRejectionReason("");
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Required", "Please provide a reason for rejection.");
      return;
    }
    if (!selectedRequestId) return;

    try {
      await updateDoc(doc(db, "od_requests", selectedRequestId), {
        status: "Rejected",
        rejectionReason: rejectionReason,
        reviewedAt: new Date().toISOString(),
      });
      setRejectModalVisible(false);
      Alert.alert("Success", "OD Rejected");
      fetchRequests();
    } catch (e) {
      Alert.alert("Error", "Failed to reject OD");
    }
  };

  const renderRequestCard = ({ item }: { item: any }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View>
          {item.type === "individual" ? (
            <View>
              <Text style={styles.studentName}>
                {item.details?.name || "Unknown"}
              </Text>
              <Text style={styles.rollNo}>
                {item.details?.rollNo || "No Roll No"}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.studentName}>Team Request</Text>
              <Text style={styles.rollNo}>
                {item.details?.members?.length || 0} Members
              </Text>
            </View>
          )}
        </View>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      </View>

      <Text style={styles.eventTitle}>{item.eventDetails}</Text>
      <Text style={styles.applyDate}>
        Applied: {new Date(item.appliedAt).toLocaleDateString()}
      </Text>

      {item.requiredInfo ? (
        <Text style={styles.reqInfo} numberOfLines={2}>
          Note: {item.requiredInfo}
        </Text>
      ) : null}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectBtn]}
          onPress={() => initReject(item.id)}
        >
          <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.approveBtn]}
          onPress={() => handleApprove(item.id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" />
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#4c1d95", "#6d28d9", "#8b5cf6"]} // Purple theme for Admin
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
          <View>
            <Text style={styles.headerTitle}>Admin Console</Text>
            <Text style={styles.headerSubtitle}>Manage OD Requests</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert("Logout", "Implement logout here")}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Pending Requests ({requests.length})
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8b5cf6"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#8b5cf6"]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="folder-open-outline"
                  size={48}
                  color="#cbd5e1"
                />
                <Text style={styles.emptyText}>
                  No pending requests to review.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Rejection Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Request</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for rejection:
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="E.g., Insufficient attendance details..."
              multiline
              numberOfLines={3}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleReject}
              >
                <Text style={styles.modalConfirmText}>Submit Rejection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  headerSubtitle: { color: "#e9d5ff", fontSize: 14, fontWeight: "500" },
  logoutButton: { padding: 8 },

  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    margin: 20,
    marginBottom: 10,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },

  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8b5cf6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  studentName: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  rollNo: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  pendingBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingText: { color: "#d97706", fontSize: 12, fontWeight: "700" },

  eventTitle: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "600",
    marginBottom: 4,
  },
  applyDate: { fontSize: 12, color: "#94a3b8", marginBottom: 8 },
  reqInfo: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 16,
    fontStyle: "italic",
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 8,
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  rejectBtn: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  approveBtn: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  rejectText: { color: "#ef4444", fontWeight: "600", fontSize: 14 },
  approveText: { color: "#22c55e", fontWeight: "600", fontSize: 14 },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalSubtitle: { fontSize: 15, color: "#64748b", marginBottom: 16 },
  modalInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    fontSize: 15,
    marginBottom: 24,
  },
  modalActions: { flexDirection: "row", gap: 12 },
  modalCancel: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  modalConfirm: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#ef4444",
  },
  modalCancelText: { color: "#64748b", fontWeight: "600" },
  modalConfirmText: { color: "#fff", fontWeight: "600" },
});
