"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getAuth, isDemoMode } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  loginAsDemo: () => void;
  logoutDemo: () => void;
}

const DEMO_USER = {
  uid: "demo-user",
  email: "demo@shipcheck.app",
  displayName: "Demo User",
} as unknown as User;

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
  loginAsDemo: () => {},
  logoutDemo: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode;

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setLoading(false);
  };

  const logoutDemo = () => {
    setUser(null);
  };

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }
    const auth = getAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [isDemo]);

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, loginAsDemo, logoutDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
