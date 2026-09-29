import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

const getRoleFromToken = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const role = payload.role || payload.roles;

    if (Array.isArray(role)) {
      return role[0] || null;
    }

    if (typeof role === "string") {
      return role.startsWith("ROLE_")
        ? role.substring(5)
        : role;
    }

    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("token");

  const [token, setToken] = useState(savedToken);
  const [role, setRole] = useState(
    savedToken
      ? getRoleFromToken(savedToken)
      : null
  );

  const [isInitializing] = useState(false);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const jwt = response.data.token;
    const userRole = getRoleFromToken(jwt);

    localStorage.setItem("token", jwt);

    setToken(jwt);
    setRole(userRole);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isAuthenticated: !!token,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};