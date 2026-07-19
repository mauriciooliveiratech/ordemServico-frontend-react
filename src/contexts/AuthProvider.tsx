import { useEffect,useState,type ReactNode } from "react";
import { api } from "../Services/api";
import { AuthContext,type Sessao } from "./AuthContext";
const KEY="@oficina-os:sessao";
export function AuthProvider({children}:{children:ReactNode}){
 const [sessao,setSessao]=useState<Sessao|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{try{const value=localStorage.getItem(KEY);if(value)setSessao(JSON.parse(value))}finally{setLoading(false)}},[]);
 async function login(email:string,senha:string,empresaId?:string){const {data}=await api.post<Sessao>("/auth/login",{email,senha,empresaId});localStorage.setItem(KEY,JSON.stringify(data));setSessao(data)}
 function logout(){localStorage.removeItem(KEY);setSessao(null)}
 return <AuthContext.Provider value={{sessao,usuario:sessao?.usuario??null,empresa:sessao?.empresa??null,loading,login,logout}}>{children}</AuthContext.Provider>
}
