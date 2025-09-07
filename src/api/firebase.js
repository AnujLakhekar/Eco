import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function signUpWithCredentials(email, password, structure) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    ...structure,
    personalInfo: {
      ...structure.personalInfo,
      email: user.email,
      uid: user.uid,
    },
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function getData(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function updateProfileData(uid, data) {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(
      userRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log(data);
    return true;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
}

// leaderbord

export async function GenLeaderBord() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("gamification.level", "desc"),
      orderBy("gamification.points", "desc")
    );

    const querySnapshot = await getDocs(q);

    const usersArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("🔥 Leaderboard (from Firestore):", usersArray);
    return usersArray;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export async function getColleges() {
  try {
   const q = query(collection(db, "colleges"));
    const querySnapshot = await getDocs(q);

    const clgArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return clgArray
  } catch (error) {
    console.log(error);
  }
}

// Sign In with Email
export async function signInWithCredentials(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}
