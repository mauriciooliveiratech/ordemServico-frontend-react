import { api } from "./api";

export type UsuarioLogado = {
  id: number;
  nome: string;
  perfil: "ADMIN" | "TECNICO";
};

export async function login(username: string, senha: string) {
  const res = await api.post<UsuarioLogado>("/api/auth/login", {
    username,
    senha,
  });

  return res.data;
}
