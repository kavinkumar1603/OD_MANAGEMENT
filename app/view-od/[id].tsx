import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { MOCK_ODS } from "../../constants/mock-data";

export default function ViewODScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const od = MOCK_ODS.find((item) => item.id === id);

  if (!od) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>OD Application not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "rejected":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OD Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: getStatusColor(od.status) + "20" },
          ]}
        >
          <Ionicons
            name={
              od.status === "Approved"
                ? "checkmark-circle"
                : od.status === "Pending"
                  ? "time"
                  : "close-circle"
            }
            size={24}
            color={getStatusColor(od.status)}
          />
          <Text
            style={[
              styles.statusBannerText,
              { color: getStatusColor(od.status) },
            ]}
          >
            {od.status}
          </Text>
        </View>

        {/* Main Info Card */}
        <View style={styles.card}>
          <Text style={styles.eventTitle}>{od.eventTitle}</Text>
          <Text style={styles.organizer}>Organized by {od.organizer}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color="#6366f1" />
            </View>
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{od.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="time" size={20} color="#6366f1" />
            </View>
            <View>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>
                {od.startTime} - {od.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={20} color="#6366f1" />
            </View>
            <View>
              <Text style={styles.label}>Venue</Text>
              <Text style={styles.value}>{od.venue}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.card}>
            <Text style={styles.descriptionText}>{od.description}</Text>
          </View>
        </View>

        {/* Team Members */}
        {od.teamMembers && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team Members</Text>
            <View style={styles.card}>
              {od.teamMembers.map((member, index) => (
                <View
                  key={index}
                  style={[styles.memberRow, index !== 0 && styles.memberBorder]}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{member.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRoll}>{member.rollNo}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rejection Reason */}
        {od.rejectionReason && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#ef4444" }]}>
              Rejection Reason
            </Text>
            <View
              style={[
                styles.card,
                { borderColor: "#fca5a5", backgroundColor: "#fef2f2" },
              ]}
            >
              <Text style={[styles.descriptionText, { color: "#b91c1c" }]}>
                {od.rejectionReason}
              </Text>
            </View>
          </View>
        )}

        {/* Applicant Info */}
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>Applied on {od.appliedDate}</Text>
          <Text style={styles.metaText}>Application ID: #{od.id}</Text>
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
    borderBottomColor: "#e2e8f0",
  },
  headerBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#64748b",
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: "700",
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
  eventTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  organizer: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#334155",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  memberBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  memberRoll: {
    fontSize: 13,
    color: "#64748b",
  },
  metaInfo: {
    marginTop: 32,
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
});
