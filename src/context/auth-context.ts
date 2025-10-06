import { createContext } from "react";

export interface User {
  userId: number;
  username: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// ✅ Solo exportamos el contexto
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
