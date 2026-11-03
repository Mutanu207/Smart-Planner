"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../lib/api";
import {
  setAccessToken as saveToken,
  clearAccessToken as removeToken,
  getAccessToken as currentToken,
  onTokenChange,
} from "../lib/auth/tokenManager";

type AuthContextType = {
  accessToken: string | null;
  authChecked: boolean;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state directly from whatever tokenManager has at the moment
  const [accessToken, setAccessTokenState] = useState<string | null>(currentToken());
  const [authChecked, setAuthChecked] = useState(false);

  const setAccessToken = (token: string) => {
    setAccessTokenState(token);
    saveToken(token);
  };

  const clearAccessToken = () => {
    setAccessTokenState(null);
    removeToken();
  };

  // Sync state if token changes from OUTSIDE React (like in api.ts interceptors)
  useEffect(() => {
    const unsubscribe = onTokenChange((newToken) => {
      setAccessTokenState(newToken);
    });

    return () => unsubscribe();
  }, []);

  // Handle the initial token refresh check on mount
  useEffect(() => {
    api
      .post("/auth/refresh-token")
      .then((response) => {
        setAccessToken(response.data.accessToken);
      })
      .catch(() => {
        clearAccessToken();
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        authChecked,
        setAccessToken,
        clearAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}