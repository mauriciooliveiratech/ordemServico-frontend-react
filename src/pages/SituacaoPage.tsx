import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { situacao } from "../types/Situacao";

export function SituacaoPage() {

    // 🔹 Nome da situação
    const [nome, setNome] = useState("");

    // 🔹 Checkbox ativo/inativo
    const [ativo, setAtivo] = useState<boolean>(true);

    // 🔹 Lista de situações vindas do backend
    const [situacoes, setSituacoes] = useState<situacao[]>([]);

    // 🔹 Carrega todas as situações
    function carregar() {
        api.get<situacao[]>("/situacoes")
            .then(res => setSituacoes(res.data))
            .catch(err => console.error("Erro ao carregar situações:", err));
    }

    // 🔹 Salva nova situação
    function salvar() {
        api.post("/situacoes", {
            nome,
            ativo, // ✅ agora envia corretamente
        })
        .then(() => {
            setNome("");
            setAtivo(true); // padrão após salvar
            carregar();
        })
        .catch(err => console.error("Erro ao salvar situação:", err));
    }

    // 🔹 Carrega ao abrir a página
    useEffect(() => {
        carregar();
    }, []);

    return (
        <div>
            <h2>Cadastro de Situação</h2>

            {/* Nome */}
            <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome da situação"
            />

            {/* Checkbox */}
            <label style={{ display: "block", marginTop: 8 }}>
                <input
                    type="checkbox"
                    checked={ativo}
                    onChange={e => setAtivo(e.target.checked)}
                />
                Ativo
            </label>

            <button onClick={salvar}>Salvar</button>

            <ul>
                {situacoes.map(s => (
                    <li key={s.id}>
                        {s.nome} - {s.ativo ? "Ativo" : "Inativo"}
                    </li>
                ))}
            </ul>
        </div>
    );
}
