import { useEffect, useState } from "react";
import { api } from "../../Services/api";
import type { OrdemServico } from "../../types/OrdemServico";
import DashboardDataGrid from "./DashboardDataGrid";
import "./dashboard.css";

export function Dashboard() {
  
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  

  useEffect(() => {
    api.get("/api/os?usuarioId=2")
      .then(res => setOrdensServico(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <div >
      <h2>Dashboard</h2>
      <DashboardDataGrid ordens={ordensServico} />
    </div>
  );
}
