export type Usuario = {
  id: number;
  username: string;
  senha: string;
  perfil: "ADMIN" | "TECNICO"
};