import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { SEED_USERS } from "../data/seedData";
import {
  loadCurrentUser,
  saveCurrentUser,
  safeRemoveItem,
  STORAGE_KEYS,
} from "../services/storageService";

const AuthContext = createContext(null);

const SEED_ADMINS = SEED_USERS.filter((user) => user.role === "admin");
const SEED_STUDENTS = SEED_USERS.filter((user) => user.role === "student");

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());

  useEffect(() => {
    if (currentUser) {
      saveCurrentUser(currentUser);
    } else {
      safeRemoveItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const login = useCallback((userId) => {
    const user = SEED_USERS.find((item) => item.id === userId);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const switchUser = useCallback((userId) => {
    const user = SEED_USERS.find((item) => item.id === userId);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      users: SEED_USERS,
      admins: SEED_ADMINS,
      students: SEED_STUDENTS,
      isAdmin: currentUser?.role === "admin",
      isStudent: currentUser?.role === "student",
      login,
      logout,
      switchUser,
    }),
    [currentUser, login, logout, switchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
