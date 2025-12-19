import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Modelo } from "../types/Modelo";
import type { Marca } from "../types/Marca";

export function ModeloPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [marcaId, setMarcaId] = useState<number>();
  const [nome, setNome] = useState("");

  useEffect(() => {
    api.get<Marca[]>("/marcas").then(res => setMarcas(res.data));
    
  }, []);
  
  useEffect(() => {
    if (marcaId) {api.get<Modelo[]>(`/marcas/${marcaId}`).then(res => setModelos(res.data));
    }
}, [marcaId]);

  function salvar() {
    api.post("/modelos", { nome, marcaId }).then(() => {
      setNome("");
      
      if (marcaId) {
        api.get<Modelo[]>(`/marcas/${marcaId}`).then(res => setModelos(res.data));
      }
    });
    
}
    return (
    <div>
      <h2>Cadastro de Modelo</h2>
      

      <input
        value={nome}
        onChange={e => setNome(e.target.value)}
        placeholder="Nome do modelo"
      />
        <select onChange={e => setMarcaId(Number(e.target.value))}>
        <option value="">Selecione a marca</option>
        {marcas.map(m => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>
      <button onClick={salvar}>Salvar</button>

      <ul>
        {modelos.map(m => (
          <li key={m.id}>{m.nome}</li>
        ))}
      </ul>
    </div>
  );
}