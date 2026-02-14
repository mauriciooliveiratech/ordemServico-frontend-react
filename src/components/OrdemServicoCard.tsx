import type { OrdemServico } from "../types/OrdemServico";
import "../pages/Dashboard/dashboard.css";


type Props = {
  os: OrdemServico;
};

export default function OrdemServicoCard({os}: Props) {
  const statusClass =
      os.situacao === "Aberto"
    ? "status-aberto"
    : os.situacao === "Em Andamento"
    ? "status-andamento"
    : os.situacao === "Finalizado"
    ? "status-finalizado"
    : "";

  return (
      <tr>
              <td>{os.id}</td>
              <td>{os.numeroOS}</td>
              <td>{os.tecnico}</td>
              <td>{new Date(os.dtCriacao.substring(0, 19)).toLocaleString("pt-BR")}</td>
              <td>{os.marca}</td>
              <td>{os.modelo}</td>
              <td>{os.servico}</td>
              <td>{os.observacao}</td>
              <td>R$ {os.valor}</td>
              <td className={statusClass}>{os.situacao}</td>
              
            </tr>
             
  

    );
  }