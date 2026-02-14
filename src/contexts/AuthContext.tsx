import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Services/api";

interface Usuario {
  id: number;
  nome: string;
  perfil: "ADMIN" | "TECNICO";
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(login: string, senha: string) {
    const { data } = await api.post("/api/auth/login", { login, senha });
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  }

  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
