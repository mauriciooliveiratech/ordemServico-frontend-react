import { useEffect, useState, type ReactNode } from "react";
import { api } from "../Services/api";
import { AuthContext, type Usuario } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(login: string, senha: string): Promise<void> {
    const { data } = await api.post<Usuario>(
      "/api/auth/login",
      { login, senha }
    );

    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  }

  function logout(): void {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
