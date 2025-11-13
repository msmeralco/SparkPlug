"use client";

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
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  token: string | null;
  state: "checking" | "unauthenticated" | "authenticated";
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<"checking" | "unauthenticated" | "authenticated">("checking");
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

  // --- Email/Password login ---
  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setState("checking");
      await signInWithEmailAndPassword(auth, email, password);
      setState("authenticated");
    } catch (err: any) {
      setError(err.message);
      setState("unauthenticated");
    }
  }, []);

  // --- Email/Password registration (with display name) ---
  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        setError(null);
        setState("checking");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }

        setUser({ ...userCredential.user });
        setState("authenticated");
      } catch (err: any) {
        setError(err.message);
        setState("unauthenticated");
      }
    },
    []
  );

  // --- Google login ---
  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setState("checking");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Optional: Update state with Google display name
      if (result.user) {
        setUser(result.user);
      }

      setState("authenticated");
    } catch (err: any) {
      setError(err.message);
      setState("unauthenticated");
    }
  }, []);

  // --- Logout ---
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
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Hook to use Auth Context ---
export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
};
