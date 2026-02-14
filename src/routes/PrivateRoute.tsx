import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";


export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  return usuario ? children : <Navigate to="/login" />;
}
