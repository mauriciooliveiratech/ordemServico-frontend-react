import axios from "axios";

export const api = axios.create({
  baseURL: "http://https://ordem-servico-frontend.vercel.app:8080", // backend Spring Boot
});



