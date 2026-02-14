import { useEffect, useState, type SetStateAction } from "react";
import { api } from "../api/axios";
import type { Marca } from "../types/Marca";

export function MarcaPage() {
  const [nome, setNome] = useState("");
  const [marcas, setMarcas] = useState<Marca[]>([]);

  function carregar() {
    api.get<Marca[]>("/marcas").then((res: { data: SetStateAction<Marca[]>; }) => setMarcas(res.data));
  }

  function salvar() {
    api.post("/marcas", nome, {
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      setNome("");
      carregar();
    });
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h2>Cadastro de Marca</h2>

      <input
        value={nome}
        onChange={e => setNome(e.target.value)}
        placeholder="Nome da marca"
      />

      <button onClick={salvar}>Salvar</button>

      <ul>
        {marcas.map(m => (
          <li key={m.id}>{m.nome}</li>
        ))}
      </ul>
    </div>
  );
}
