export type Usuario = {
  id: number;
  login: string;
  senha: string;
  nome: string;
  perfil: "ADMIN" | "TECNICO"
};