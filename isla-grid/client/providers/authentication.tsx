"use client"

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  onIdTokenChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  token: string | null;
  state: "checking" | "unauthenticated" | "authenticated";
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<
    "checking" | "unauthenticated" | "authenticated"
  >("checking");
  const [error, setError] = useState<string | null>(null);

  // --- Listen to Firebase auth changes ---
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setUser(firebaseUser);
        setToken(token);
        setState("authenticated");
      } else {
        setUser(null);
        setToken(null);
        setState("unauthenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Auth actions ---
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setState("checking");
        await signInWithEmailAndPassword(auth, email, password);
        setState("authenticated");
      } catch (err: any) {
        setError(err.message);
        setState("unauthenticated");
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setState("checking");
        console.log("register", email, password);
        await createUserWithEmailAndPassword(auth, email, password);
        setState("authenticated");
      } catch (err: any) {
        setError(err.message);
        setState("unauthenticated");
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      setState("unauthenticated");
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const value: AuthState = {
    user,
    token,
    state,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
};
