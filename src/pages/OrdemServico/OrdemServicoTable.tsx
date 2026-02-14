import type {OrdemServico} from '../../types/OrdemServico';

export function OrdemServicoTable({ data }: { data: OrdemServico[] }) {
    return (
        <table width="100%" border={1} cellPadding={8}>
            <thead>
                <tr>
                    <th>OS</th>
                    <th>Data Abertura</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Serviço</th>
                    <th>Situação</th>
                    <th>Técnico</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                {data.map(os => (
                    <tr key={os.id}>
                        <td>{os.numeroOS}</td>
                        <td>{new Date(os.dtCriacao.substring(0, 19)).toLocaleString("pt-BR")}</td>
                        <td>{os.marca}</td>
                        <td>{os.modelo}</td>
                        <td>{os.servico}</td>
                        <td>{os.situacao}</td>
                        <td>{os.usuario}</td>  
                        <td>R$ {os.valor}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}