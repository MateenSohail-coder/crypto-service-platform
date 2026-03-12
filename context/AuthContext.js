"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // MUST start as true

  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (
        !storedToken ||
        storedToken === "null" ||
        storedToken === "undefined"
      ) {
        // No token — definitely not logged in
        setLoading(false);
        return;
      }

      // Validate against server
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!res.ok) {
        // Token invalid or user deleted
        clearSession();
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.success || !data.user) {
        clearSession();
        setLoading(false);
        return;
      }

      // Valid session
      setUser(data.user);
      setToken(storedToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      // Network error — try localStorage fallback
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (
          storedToken &&
          storedUser &&
          storedToken !== "null" &&
          storedUser !== "null"
        ) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch {
        clearSession();
      }
    } finally {
      // Always set loading false at the end
      setLoading(false);
    }
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  const refreshUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken || storedToken === "null" || storedToken === "undefined")
        return;

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!res.ok) {
        clearSession();
        return;
      }

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("refreshUser error:", err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
