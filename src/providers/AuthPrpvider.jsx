import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, getData } from "../api/firebase.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ auth: false, get: null });
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          // Fetch Firestore data here
          const userData = await getData(u.uid);

          setUser({
            auth: true,
            get: userData || { uid: u.uid, email: u.email }, // fallback if no Firestore doc
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({ auth: true, get: { uid: u.uid, email: u.email } });
        }
      } else {
        setUser({ auth: false, get: null });
      }

      setLoader(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };
