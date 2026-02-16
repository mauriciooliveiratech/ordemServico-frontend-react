import axios from "axios";

export const api = axios.create({
  baseURL: "http://ordem-servico-frontend.vercel.app/api/os", // backend Spring Boot
});



