import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Modelo } from "../../types/Modelo";
import type { Marca } from "../../types/Marca";



export function ModeloPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [marcaId, setMarcaId] = useState<number | "">("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  /* =======================
     CARREGAR MARCAS
  ======================== */
  useEffect(() => {
    api
      .get<Marca[]>("/marcas")
      .then((res) => setMarcas(res.data))
      .catch((err) => console.error("Erro ao carregar marcas", err));
  }, []);

  /* =======================
     CARREGAR MODELOS DA MARCA
  ======================== */
  useEffect(() => {
    if (!marcaId) {
      setModelos([]);
      return;
    }

    api
      .get<Modelo[]>(`/modelos?marcaId=${marcaId}`)
      .then((res) => setModelos(res.data))
      .catch((err) => console.error("Erro ao carregar modelos", err));
  }, [marcaId]);

  /* =======================
     SALVAR MODELO
  ======================== */
  const salvar = async () => {
    if (!nome.trim() || !marcaId) return;

    try {
      setLoading(true);

      await api.post("/modelos", {
        nome,
        marcaId,
      });

      setNome("");

      const res = await api.get<Modelo[]>(
        `/modelos?marcaId=${marcaId}`
      );
      setModelos(res.data);
    } catch (error) {
      console.error("Erro ao salvar modelo", error);
    } finally {
      setLoading(false);
      
    }
  };

  /* =======================
     RENDER
  ======================== */
  return (
    <div>
      <h2>Cadastro de Modelo</h2>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do modelo"
      />

      <select
        value={marcaId}
        onChange={(e) =>
          setMarcaId(
            e.target.value ? Number(e.target.value) : ""
          )
        }
      >
        <option value="">Selecione a marca</option>
        {marcas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>

      <button onClick={salvar} disabled={loading}>
       
        {loading ? "Salvando..." : "Salvar"}
      </button>

      <ul>
        {modelos.map((m) => (
          <li key={m.id}>{m.nome}</li>
        ))}
      </ul>
    </div>
  );
}
