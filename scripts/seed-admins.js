const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
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

const admins = [
  {
    name: "ANANDARAJ A",
    staffId: "SECETCS073",
    dept: "CSE",
    phone: "9952667716",
    email: "anandaraj.a@sece.ac.in",
  },
  {
    name: "Kirubakaran R",
    staffId: "SECETCS183",
    dept: "CSE",
    phone: "9629026910",
    email: "kirubakaran.r@sece.ac.in",
  },
  {
    name: "AGALYA K",
    staffId: "SECETCS127",
    dept: "CSE",
    phone: "9655242293",
    email: "agalya.k@sece.ac.in",
  },
];

async function seedAdmins() {
  console.log(`Found ${admins.length} admins to process.`);
  let successCount = 0;
  let failCount = 0;

  for (const admin of admins) {
    const password = admin.staffId; // Password is their ID

    try {
      console.log(`Processing Admin: ${admin.email} (${admin.staffId})...`);

      let uid;
      try {
        // Try to create user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          admin.email,
          password,
        );
        uid = userCredential.user.uid;
        console.log(`  Created Auth user: ${uid}`);
      } catch (createError) {
        if (createError.code === "auth/email-already-in-use") {
          console.log(`  User exists. Signing in...`);
          const signInCred = await signInWithEmailAndPassword(
            auth,
            admin.email,
            password,
          );
          uid = signInCred.user.uid;
        } else {
          throw createError;
        }
      }

      if (uid) {
        // 1. Add to 'admins' collection
        const adminData = {
          name: admin.name,
          staffId: admin.staffId,
          department: admin.dept,
          email: admin.email,
          phone: admin.phone,
          role: "admin",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "admins", uid), adminData);
        console.log(`  Updated Firestore: admins/${uid}`);

        // 2. Add to 'rollNo_lookup' so they can login with Staff ID
        // The login screen looks up in 'rollNo_lookup' if input has no '@'
        await setDoc(doc(db, "rollNo_lookup", admin.staffId), {
          email: admin.email,
        });
        console.log(`  Updated Lookup: rollNo_lookup/${admin.staffId}`);

        successCount++;
      }

      await signOut(auth);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(
        `  Failed to process ${admin.email}:`,
        error.code,
        error.message,
      );
      failCount++;
      try {
        await signOut(auth);
      } catch (e) {}
    }
  }

  console.log("--------------------------------------------------");
  console.log(
    `Admin Seeding completed. Success: ${successCount}, Failed: ${failCount}`,
  );
}

seedAdmins();
