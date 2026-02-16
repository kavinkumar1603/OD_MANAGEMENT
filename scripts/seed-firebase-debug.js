const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Explicitly load .env
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const csvFilePath = path.join(process.cwd(), "assets", "CSE-B_DB.csv");

async function seedData() {
  try {
    if (!fs.existsSync(csvFilePath)) {
      console.error(`Error: CSV file not found at ${csvFilePath}`);
      return;
    }

    const fileContent = fs.readFileSync(csvFilePath, "utf-8");
    const lines = fileContent.split("\n");
    // Skip header
    const dataLines = lines.slice(1);

    console.log(`Found ${dataLines.length} rows to process.`);
    let successCount = 0;
    let failCount = 0;

    let currentRetry = 0;
    const MAX_RETRIES = 3;

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      const values = line.split(",");
      // CSV columns: Name,Roll_no,Class,Email,Phone
      const user = {
        name: values[0]?.trim(),
        rollNo: values[1]?.trim(),
        className: values[2]?.trim(),
        email: values[3]?.trim(),
        phone: values[4]?.trim().replace("\r", ""), // clean potential carriage return
        role: "student",
      };

      if (!user.email || !user.rollNo) {
        console.warn(
          `Skipping row ${i + 2}: Missing Email or Roll No. Content: ${line}`,
        );
        continue;
      }

      // Ensure password is at least 6 chars
      if (user.rollNo.length < 6) {
        console.warn(`Skipping ${user.email}: Password (RollNo) too short.`);
        continue;
      }

      const password = user.rollNo;

      try {
        console.log(
          `Processing [${i + 1}/${dataLines.length}]: ${user.email} (${user.rollNo})...`,
        );

        let uid;
        try {
          // Try to create user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            user.email,
            password,
          );
          uid = userCredential.user.uid;
          console.log(`  Created Auth user: ${uid}`);
        } catch (createError) {
          if (createError.code === "auth/email-already-in-use") {
            console.log(`  User exists. Signing in...`);
            // Sign in to get UID and permission to write to their doc
            const signInCred = await signInWithEmailAndPassword(
              auth,
              user.email,
              password,
            );
            uid = signInCred.user.uid;
          } else {
            throw createError;
          }
        }

        if (uid) {
          // Add to Firestore 'students' collection
          await setDoc(doc(db, "students", uid), {
            ...user,
            createdAt: new Date().toISOString(),
          });
          console.log(`  Updated Firestore: students/${uid}`);

          // Add lookup by rollNo
          await setDoc(doc(db, "rollNo_lookup", user.rollNo), {
            email: user.email,
          });
          console.log(`  Updated Lookup: rollNo_lookup/${user.rollNo}`);

          successCount++;
          currentRetry = 0; // Reset retry count after success
        }

        // Sign out to clean up context
        await signOut(auth);

        // Throttle slightly
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(
          `  Failed to process ${user.email}: ${error.code || error.message}`,
        );

        // Ensure logout
        try {
          await signOut(auth);
        } catch (e) {}

        // Retry logic
        if (currentRetry < MAX_RETRIES) {
          console.log(
            `  Retrying ${user.email} in 2 seconds... (Attempt ${currentRetry + 1}/${MAX_RETRIES})`,
          );
          await new Promise((r) => setTimeout(r, 2000));
          currentRetry++;
          i--; // Decrement index to retry this user
          continue;
        } else {
          console.error(
            `  Given up on ${user.email} after ${MAX_RETRIES} retries.`,
          );
          failCount++;
          currentRetry = 0; // Reset for next user
        }
      }
    }

    console.log("--------------------------------------------------");
    console.log(
      `Seeding completed. Success: ${successCount}, Failed: ${failCount}`,
    );
  } catch (error) {
    console.error("Critical error in seedData:", error);
  }
}

seedData();
