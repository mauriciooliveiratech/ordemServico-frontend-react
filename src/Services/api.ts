import axios from "axios";

const baseURL = process.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: baseURL,
} );



