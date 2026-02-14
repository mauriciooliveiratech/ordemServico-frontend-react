import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { servico } from "../../types/Servico";

export function ServicoPage() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [servicos, setServicos] = useState<servico[]>([]);
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
    if (!nome.trim() || !valor || Number(valor) <= 0) return;

    try {
      setLoading(true);

      await api.post("/servicos", {
        nome,
        valor: Number(valor),
      });

      setNome("");
      setValor("");
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
      <h2>Cadastro de Serviço</h2>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do serviço"
      />

      <input
        type="number"
        value={valor}
        onChange={(e) =>
          setValor(e.target.value ? Number(e.target.value) : "")
        }
        placeholder="Preço do serviço"
      />

      <button onClick={salvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>

      <ul>
        {servicos.map((s) => (
          <li key={s.id}>
            {s.nome} — R$ {Number(s.valor).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
