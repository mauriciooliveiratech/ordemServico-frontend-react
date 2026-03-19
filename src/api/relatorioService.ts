import { api } from "../Services/api";


export interface FaturamentoMensal {
  mes: number;
  total: number;
}

export function buscarFaturamentoAnual(
  ano: number,
  marcaId?: number,
  modeloId?: number
) {
  return api.get<FaturamentoMensal[]>("/relatorios/faturamento-anual", {
    params: {
      ano,
      marcaId,
      modeloId,
    },
  });
}