import { createContext } from "react";
export type Papel="PROPRIETARIO"|"ADMIN"|"TECNICO";
export interface Usuario{id:string;nome:string;email:string;papel:Papel}
export interface Empresa{id:string;nome:string}
export interface Sessao{token:string;usuario:Usuario;empresa:Empresa}
export interface AuthContextType{sessao:Sessao|null;usuario:Usuario|null;empresa:Empresa|null;loading:boolean;login:(email:string,senha:string,empresaId?:string)=>Promise<void>;logout:()=>void}
export const AuthContext=createContext<AuthContextType>({} as AuthContextType);
