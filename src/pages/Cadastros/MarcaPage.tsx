import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Marca } from "../../types/Marca";

export function MarcaPage() {
  const [nome, setNome] = useState("");
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    try {
      const res = await api.get<Marca[]>("/marcas");
      setMarcas(res.data);
    } catch (error) {
      console.error("Erro ao carregar marcas", error);
    }
  };

  const salvar = async () => {
    if (!nome.trim()) return;

    try {
      setLoading(true);

      await api.post("/marcas", {
        nome,
      });

      setNome("");
      carregar();
    } catch (error) {
      console.error("Erro ao salvar marca", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h2>Cadastro de Marca</h2>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da marca"
      />

      <button onClick={salvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>

      <ul>
        {marcas.map((m) => (
          <li key={m.id}>{m.nome}</li>
        ))}
      </ul>
    </div>
  );
}

