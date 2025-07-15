// src/contexts/AuthContext.tsx
import { createContext, useState, useContext } from "react";
import { loginAPI } from "../../services/api";

type AuthContextType = {
  uid: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const login = async (email: string, password: string) => {
    const response = await loginAPI(email, password);
    const data = await response.json();
    setUid(data.user_id);

  };
  const logout = () => {
    setUid(null);
  };

  console.log("AuthProvider rendered with uid:", uid);

  return (
    <AuthContext.Provider value={{ uid, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}