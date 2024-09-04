"use client";

import React, { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  provider,
  facebookProvider,
  appleProvider,
} from "../utils/firebase";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null);

export const AuthContextProvider = ({ children }: any) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw new Error("Failed to sign in with Google");
    }
  };

  const appleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      return result.user;
    } catch (error) {
      console.error("Failed to sign in with Apple", error);
    }
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/auth/login");
        sessionStorage.removeItem("token");
      })
      .catch((error:any) => {
        console.error("Failed to sign out", error);
      });
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser:any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, appleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
