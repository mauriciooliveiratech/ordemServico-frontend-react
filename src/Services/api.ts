import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config)=>{
  const raw=localStorage.getItem("@oficina-os:sessao");
  if(raw){try{const {token}=JSON.parse(raw);if(token)config.headers.Authorization=`Bearer ${token}`}catch{localStorage.removeItem("@oficina-os:sessao")}}
  return config;
});
api.interceptors.response.use(r=>r,error=>{if(error.response?.status===401&&localStorage.getItem("@oficina-os:sessao")){localStorage.removeItem("@oficina-os:sessao");window.location.assign("/login")}return Promise.reject(error)});
