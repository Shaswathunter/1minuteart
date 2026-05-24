import { createContext, useContext, useMemo, useState } from "react";

import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

const storedToken = localStorage.getItem("token");
const storedUserRaw = localStorage.getItem("user");
let storedUser = null;

if (storedUserRaw) {
  try {
    storedUser = JSON.parse(storedUserRaw);
  } catch (error) {
    localStorage.removeItem("user");
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storedToken || "");
  const [user, setUser] = useState(storedUser);
  const [authLoading, setAuthLoading] = useState(false);

  const saveAuth = (payload) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (payload) => {
    setAuthLoading(true);
    try {
      const data = await loginUser(payload);
      saveAuth(data);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const data = await registerUser(payload);
      saveAuth(data);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      authLoading,
      login,
      register,
      logout
    }),
    [token, user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
