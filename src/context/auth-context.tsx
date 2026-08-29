"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

  export interface AuthUser {
    id: string;
    phone: string;
    name: string | null;
    role: string;
    email?: string | null;
    status_val?: string;
    rating?: number | null;
    avatar_url?: string | null;
    total_rides?: number | null;
  }

  interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextType | null>(null);
  const TOKEN_KEY = "urbont_auth_token";
  const API = "";

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async (storedToken: string) => {
      const r = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } });
      const data = await r.json() as { user?: Record<string, unknown> };
      if (data.user) {
        const u = data.user;
        setToken(storedToken);
        setUser({
          id: u["id"] as string,
          phone: u["phone"] as string,
          name: (u["first_name"] as string | null) ?? null,
          role: (u["role"] as string) ?? "passenger",
          email: u["email"] as string | null,
          status_val: u["status_val"] as string | undefined,
          rating: u["rating"] as number | null,
          avatar_url: u["avatar_url"] as string | null,
          total_rides: u["total_rides"] as number | null,
        });
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    };

    useEffect(() => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) { setIsLoading(false); return; }
      fetchUser(storedToken).catch(() => localStorage.removeItem(TOKEN_KEY)).finally(() => setIsLoading(false));
    }, []);

    const login = (newToken: string, newUser: AuthUser) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(newUser);
    };

    const logout = () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    };

    const refreshUser = async () => {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t) await fetchUser(t).catch(() => {});
    };

    return (
      <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
  }
  