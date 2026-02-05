import React, { createContext, useContext, useMemo, useState } from "react";
import { getToken, setToken, clearToken, getUser, setUser, clearUser } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getUser());

  const login = (newToken, userData) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(userData);
    setUserState(userData);
  };

  const logout = () => {
    clearToken();
    clearUser();
    setTokenState(null);
    setUserState(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin"
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
