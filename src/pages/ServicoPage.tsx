import { useEffect, useState, type SetStateAction } from "react";
import { api } from "../api/axios";
import type { servico } from "../types/Servico";

export function ServicoPage() {
    const [nome, setNome] = useState("");   
    const [valor, setValor] = useState<number>(0);
    const [servicos, setServicos] = useState<servico[]>([]);
    
    function carregar() {
        api.get<servico[]>("/servicos").then((res: { data: SetStateAction<servico[]>; }) => setServicos(res.data));
    }

    function salvar() {
        api.post("/servicos", { nome, valor }, {
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            setNome("");
            setValor(0);
            carregar();
        });
    }

    useEffect(() => {
        carregar();
    }, []);

    return (
        <div>
            <h2>Cadastro de Serviço</h2>

            <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do serviço"
            />
            
            <input
                type="number"
                value={valor}
                onChange={e => setValor(Number(e.target.value))}
                placeholder="Preço do serviço"
            />
            <button onClick={salvar}>Salvar</button>

            <ul>
                {servicos.map(s => (
                    <li key={s.id}>{s.nome} - R$ {s.valor.toFixed(2)}</li>
                ))}
            </ul>
        </div>
    );
}