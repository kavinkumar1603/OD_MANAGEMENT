import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ODType = "individual" | "team";

interface TeamMember {
  name: string;
  rollNo: string;
}

export default function ApplyODScreen() {
  const router = useRouter();
  const [odType, setOdType] = useState<ODType>("individual");

  // Individual State
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  // Team State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", rollNo: "" },
  ]);

  // Common State
  const [eventDetails, setEventDetails] = useState("");
  const [requiredInfo, setRequiredInfo] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", rollNo: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      const updatedMembers = [...teamMembers];
      updatedMembers.splice(index, 1);
      setTeamMembers(updatedMembers);
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  const pickImage = async (mode: "camera" | "library") => {
    try {
      let result;
      if (mode === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permission Required",
            "Please allow camera access to take photos.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permission Required",
            "Please allow gallery access to upload photos.",
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleUpload = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removeAttachment = () => {
    setImage(null);
  };

  const handleSubmit = () => {
    // Basic validation
    if (odType === "individual") {
      if (!name || !rollNo || !eventDetails || !requiredInfo) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
    } else {
      const isTeamValid = teamMembers.every((m) => m.name && m.rollNo);
      if (!isTeamValid || !eventDetails || !requiredInfo) {
        Alert.alert(
          "Error",
          "Please fill in all fields including team members",
        );
        return;
      }
    }

    // Here you would typically send data to backend
    Alert.alert("Success", "OD Application Submitted Successfully", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for OD</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* OD Type Selection */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              odType === "individual" && styles.activeType,
            ]}
            onPress={() => setOdType("individual")}
          >
            <Text
              style={[
                styles.typeText,
                odType === "individual" && styles.activeTypeText,
              ]}
            >
              Individual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, odType === "team" && styles.activeType]}
            onPress={() => setOdType("team")}
          >
            <Text
              style={[
                styles.typeText,
                odType === "team" && styles.activeTypeText,
              ]}
            >
              Team
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Form Fields */}
        <View style={styles.formContainer}>
          {odType === "individual" ? (
            // Individual Fields
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Roll No</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your roll number"
                  value={rollNo}
                  onChangeText={setRollNo}
                />
              </View>
            </>
          ) : (
            // Team Fields
            <>
              <Text style={styles.sectionTitle}>Team Members</Text>
              {teamMembers.map((member, index) => (
                <View key={index} style={styles.memberCard}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberTitle}>Member {index + 1}</Text>
                    {teamMembers.length > 1 && (
                      <TouchableOpacity onPress={() => removeTeamMember(index)}>
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ef4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Member Name"
                      value={member.name}
                      onChangeText={(text) =>
                        updateTeamMember(index, "name", text)
                      }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Roll No</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Member Roll No"
                      value={member.rollNo}
                      onChangeText={(text) =>
                        updateTeamMember(index, "rollNo", text)
                      }
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={addTeamMember}
              >
                <Ionicons name="add-circle-outline" size={20} color="#2563eb" />
                <Text style={styles.addButtonText}>Add Team Member</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Common Fields */}
          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the event..."
              multiline
              numberOfLines={4}
              value={eventDetails}
              onChangeText={setEventDetails}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Information</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any other details required..."
              multiline
              numberOfLines={3}
              value={requiredInfo}
              onChangeText={setRequiredInfo}
              textAlignVertical="top"
            />
          </View>

          {/* Attachment Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Poster / Payment Proof</Text>
            {!image ? (
              <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={32}
                    color="#64748b"
                  />
                </View>
                <Text style={styles.uploadText}>Upload Image</Text>
                <Text style={styles.uploadSubtext}>
                  Supports JPG, PNG (Max 5MB)
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.uploadedFileContainer}>
                <View style={styles.fileInfo}>
                  <Image source={{ uri: image }} style={styles.thumbnail} />
                  <Text style={styles.fileName}>Image Selected</Text>
                </View>
                <TouchableOpacity
                  onPress={removeAttachment}
                  style={styles.removeFileButton}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
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
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeType: {
    backgroundColor: "#eff6ff",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTypeText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  formContainer: {
    gap: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#64748b",
  },
  uploadedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  removeFileButton: {
    padding: 4,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  textArea: {
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  memberCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
    marginBottom: 12,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
