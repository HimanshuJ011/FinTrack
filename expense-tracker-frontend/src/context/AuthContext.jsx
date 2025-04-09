import React, { createContext, useState, useEffect } from "react";
import authService from "../api/authService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setCurrentUser(decodedUser);
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await authService.login(username, password);
      const decodedUser = jwtDecode(data.token);
      setCurrentUser(decodedUser);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);

      const status = err.response?.status;
      const message = err.response?.data?.message || "Failed to login";

      if (status === 401) {
        alert("Incorrect password. Please try again.");
      } else {
        setError(message);
      }

      throw err; // So `handleSubmit` can still catch it
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(username, email, password);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
