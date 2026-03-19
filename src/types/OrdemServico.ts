

export interface OrdemServico {
  servicoId: any;
  id: number;
  numeroOS: string;

  dtCriacao: string;

  marca:{
    id: number;
    nome: string;
  };
  modelo:{
    id: number;
    nome: string;
  } 
  servico: {
    servico_id : number;
    id: number;
    nome: string;
  };

  usuario: {
    id: number;
    nome: string;
    perfil: string;
  };

  observacao: string;
  valor: number;
  custo: number;  
  situacao: string;
 
}



