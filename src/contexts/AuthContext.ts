import { createContext } from "react";

export interface Usuario {
  id: number;
  nome: string;
  perfil: "ADMIN" | "TECNICO";
}

export interface AuthContextType {
  usuario: Usuario | null;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);