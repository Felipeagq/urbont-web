"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  phone: string;
  email?: string | null;
  name: string | null;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_KEY = "urbont_auth_token";

/**
 * Forma que devuelve GET /api/auth/me.
 *
 * Ojo: en urbont-api estos campos vienen al nivel raíz de la respuesta; aquí el
 * route handler los envuelve en `user`, que es como estaba desde la migración.
 * Se mantiene esa forma para que el frontend y el API de websitev2 sigan siendo
 * coherentes entre sí.
 */
interface MeResponse {
  user?: {
    id?: string;
    user_id?: string;
    phone?: string;
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    role?: string;
  };
  error?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${storedToken}` } })
      .then((r) => r.json())
      .then((data: MeResponse) => {
        const u = data.user;
        // `id` viene del perfil de Supabase; `user_id`, del payload del token
        // cuando el perfil aún no existe.
        const id = u?.id ?? u?.user_id;

        if (id && !data.error) {
          setToken(storedToken);
          setUser({
            id,
            phone: u?.phone ?? "",
            email: u?.email ?? null,
            name: u?.first_name ? `${u.first_name} ${u.last_name ?? ""}`.trim() : null,
            role: u?.role,
          });
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
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

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
