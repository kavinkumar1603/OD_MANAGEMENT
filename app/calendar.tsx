import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../configs/firebase";

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("March 2024");
  const [ods, setOds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchODs = () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "od_requests"),
        where("userId", "==", user.uid),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const odList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOds(odList);
        setLoading(false);
      });

      return unsubscribe;
    };

    return fetchODs();
  }, []);

  // Group events by date
  const eventsByDate = ods.reduce((acc: any, od) => {
    const dateKey =
      od.date || (od.appliedAt ? od.appliedAt.split("T")[0] : "Unknown");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(od);
    return acc;
  }, {});

  const dates = Object.keys(eventsByDate).sort();

  const renderEvent = (od: any) => (
    <View key={od.id} style={styles.eventCard}>
      <View
        style={[
          styles.timeStrip,
          { backgroundColor: od.status === "Approved" ? "#22c55e" : "#cbd5e1" },
        ]}
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>
          {od.eventTitle || od.eventDetails}
        </Text>
        <Text style={styles.eventTime}>
          {od.startTime || "N/A"} - {od.endTime || "N/A"}
        </Text>
        <Text style={styles.eventVenue}>
          <Ionicons name="location-outline" size={12} /> {od.venue || "N/A"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const renderDateGroup = ({ item }: { item: string }) => {
    const day = new Date(item).getDate();
    const weekday = new Date(item).toLocaleDateString("en-US", {
      weekday: "short",
    });

    return (
      <View style={styles.dateGroup}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateNumber}>{day}</Text>
          <Text style={styles.dateWeekday}>{weekday}</Text>
        </View>
        <View style={styles.eventsColumn}>
          {eventsByDate[item].map((od: any) => renderEvent(od))}
        </View>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={20} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{selectedMonth}</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dates}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item}
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
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  listContent: {
    padding: 20,
  },
  dateGroup: {
    flexDirection: "row",
    marginBottom: 24,
  },
  dateColumn: {
    width: 50,
    alignItems: "center",
    marginRight: 16,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  dateWeekday: {
    fontSize: 13,
    color: "#64748b",
    textTransform: "uppercase",
  },
  eventsColumn: {
    flex: 1,
    gap: 12,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeStrip: {
    width: 6,
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },
  eventVenue: {
    fontSize: 12,
    color: "#94a3b8",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
