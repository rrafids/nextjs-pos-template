import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type AuthContextValue = {
  token: string | null;
  authReady: boolean;
  login: (username?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "pos-ui/auth-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setToken(saved);
    }
    setAuthReady(true);
  }, []);

  const login = (username?: string) => {
    const value = username && username.trim().length > 0 ? `token:${username.trim()}` : "token:guest";
    setToken(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    router.push("/inventory").catch(() => {});
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    router.push("/login").catch(() => {});
  };

  const value = useMemo(
    () => ({
      token,
      authReady,
      login,
      logout,
    }),
    [token, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useRequireAuth() {
  const { token, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authReady && !token) {
      router.push("/login").catch(() => {});
    }
  }, [authReady, token, router]);

  return { token, authReady };
}

