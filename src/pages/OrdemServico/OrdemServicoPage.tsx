import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { OrdemServico } from "../../types/OrdemServico";
import type { SelectOption } from "../../types/SelectOption";

export function OrdemServicoPage() {
    // 🔹 Formulário de ordem de serviço

    const [usuarioId, setUsuarioId] = useState<number>();
    const [numeroOS, setNumeroOS] = useState("");
    const [observacao, setObservacao] = useState("");  
    
    const [marcaId, setMarcaId] = useState<number>();
    const [modeloId, setModeloId] = useState<number>();
    const [servicoId, setServicoId] = useState<number>();
    const [situacaoId, setSituacaoId] = useState<number>();
    const [custo, setCusto] = useState<number>(0);
    const [valor, setValor] = useState<number>(0);
    
    // 🔹 Listas para selects   
    const [marcas, setMarcas] = useState<SelectOption[]>([]);
    const [modelos, setModelos] = useState<SelectOption[]>([]);
    const [servicos, setServicos] = useState<SelectOption[]>([]);
    const [situacoes, setSituacoes] = useState<SelectOption[]>([]);
    const [usuarios, setUsuarios] = useState<SelectOption[]>([]);
    
    // 🔹 Carrega dados para selects
    useEffect(() => {
        api.get<SelectOption[]>("/marcas").then(res => setMarcas(res.data));
        api.get<SelectOption[]>("/modelos").then(res => setModelos(res.data));
        api.get<SelectOption[]>("/servicos").then(res => setServicos(res.data));
        api.get<SelectOption[]>("/situacoes").then(res => setSituacoes(res.data));
        api.get<SelectOption[]>("/usuarios").then(res => setUsuarios(res.data));
    }, []);

    // 🔹 Salva ordem de serviço
    function salvarOS() {
        const payload: OrdemServico= {
            id: 0,
            numeroOS: numeroOS,
            tecnico: usuarioId ? usuarioId.toString() : "",
            dtCriacao: new Date().toISOString(),
            marca: marcaId ? marcaId.toString() : "",
            modelo: modeloId ? modeloId.toString() : "",
            situacao: situacaoId ? situacaoId.toString() : "",
            servico: servicoId ? servicoId.toString() : "",
            observacao,
            custo: 0,
            valor: 0,
        };

        api.post("/os", payload)
            .then(() => {
                // Limpa formulário após salvar
                alert("Ordem de serviço criada com sucesso!");
                limpaFormulario();
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao criar ordem de serviço.");
            });
    }
    
    function limpaFormulario() {
        setNumeroOS("");
        setObservacao("");
        setMarcaId(undefined);
        setModeloId(undefined);
        setServicoId(undefined);
        setSituacaoId(undefined);
    }   
    return (
        <div>
            <h2>Cadastro de Ordem de Serviço</h2>
            {/* Numeroda OS */}
            <input 
            placeholder="Número OS"
            value={numeroOS}
            onChange={e => setNumeroOS(e.target.value)}
            />
            {/* Marca */}
            <select onChange={e => setMarcaId(Number(e.target.value))}>
                <option value="">Selecione uma marca</option>
                {marcas.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
            </select>

            {/* Modelo */}
            <select onChange={e => setModeloId(Number(e.target.value))}>
                <option value="">Selecione um modelo</option>
                {modelos.map(modelo => (
                    <option key={modelo.id} value={modelo.id}>{modelo.nome}</option>
                ))}
            </select>

            {/* Serviço */}
            <select onChange={e => setServicoId(Number(e.target.value))}>
                <option value="">Selecione um serviço</option>
                {servicos.map(servico => (
                    <option key={servico.id} value={servico.id}>{servico.nome}</option>
                ))}
            </select>

            {/* Situação */}
            <select onChange={e => setSituacaoId(Number(e.target.value))}>
                <option value="">Selecione uma situação</option>
                {situacoes.map(situacao => (
                    <option key={situacao.id} value={situacao.id}>{situacao.nome}</option>
                ))}
            </select>

            {/* Técnico */}
            <select onChange={e => setUsuarioId(Number(e.target.value))}>
                <option value="">Selecione um Tecnico</option>
                {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                ))}
            </select>
            
            {/* valor */}
            <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
/>
            {/* Custo */}
            <input
            type="number"
            step="0.01"
            placeholder="Custo"
            value={custo}
            onChange={(e) => setCusto(Number(e.target.value))}
/>    

            {/* Observação */}
            <input 
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
/>
            <button onClick={salvarOS}>Salvar OS</button>
        </div>
    );
}