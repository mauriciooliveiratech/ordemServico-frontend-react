import { useEffect, useState } from "react";

import type { servico } from "../../types/Servico";
import { api } from "../../Services/api";

export function ServicoPage() {
  const [nome, setNome] = useState("");
  const [, setServicos] = useState<servico[]>([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     CARREGAR SERVIÇOS
  ======================== */
  const carregar = () => {
    api
      .get<servico[]>("/servicos")
      .then((res) => setServicos(res.data))
      .catch((err) =>
        console.error("Erro ao carregar serviços", err)
      );
  };

  /* =======================
     SALVAR SERVIÇO
  ======================== */
  const salvar = async () => {
    if (!nome.trim() || nome.trim().length < 2) return;

    try {
      setLoading(true);

      await api.post("/servicos", {
        nome,
      });

      setNome("");
      carregar();
    } catch (error) {
      console.error("Erro ao salvar serviço", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  /* =======================
     RENDER
  ======================== */
  return (
    <div>
      

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do serviço"
      />



      <button onClick={salvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
      
      
     
    </div>
  );
}



