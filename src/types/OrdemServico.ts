

export interface OrdemServico {
  id: number;
  numeroOS: string;
  dtCriacao: string;

  usuario: string;
  usuarioId: number;

  marca: string;
  modelo: string;
  servicoId: number;
  servico: string;
  observacao?: string;

  valor: number;
  custo: number;  
  situacao: string;
 
}



