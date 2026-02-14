import { Navigate } from "react-router-dom";

import type { JSX } from "react";
import { useAuth } from "../contexts/useAuth";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  return usuario ? children : <Navigate to="/login" />;
}
