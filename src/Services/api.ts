import axios from "axios";

export const api = axios.create({
  baseURL: "http://ordem-servico-frontend.vercel.app", // backend Spring Boot
});



