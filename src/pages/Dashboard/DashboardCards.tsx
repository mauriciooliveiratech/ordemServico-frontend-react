import {
  Box,
  Card,
  Typography,
} from "@mui/material";
import type { OrdemServico } from "../../types/OrdemServico";
import { useMemo } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  ordens: OrdemServico[];              // total geral
  ordensFiltradas: OrdemServico[];     // resultado do filtro
  mesSelecionado: number | null;
  setMesSelecionado: (mes: number | null) => void;
  dataInicio: string;
  setDataInicio: (v: string) => void;
  dataFim: string;
  setDataFim: (v: string) => void;
};

export default function DashboardCards({
  ordens,
  ordensFiltradas,
}: Props) {

  
  /* =======================
     RESUMO FILTRADO
  ======================== */

 
  const resumoFiltrado = useMemo(() => {
    const finalizadas = ordensFiltradas.filter(
      (o) => o.situacao === "Finalizado"
    );

    const abertas = ordensFiltradas.filter(
      (o) => o.situacao === "Aberto"
    );
    const garantia = ordensFiltradas.filter(
      (o) => o.situacao === "Garantia"
    );
    const andamento = ordensFiltradas.filter(
      (o) => o.situacao === "Em Andamento"
    );

    const cancelado = ordensFiltradas.filter(
      (o) => o.situacao === "Cancelado"
    );

    const faturado = finalizadas.reduce(
      (acc, o) => acc + Number(o.valor ?? 0),
      0
    );

    const custo = finalizadas.reduce(
      (acc, o) => acc + Number(o.custo ?? 0),
      0
    );
    

    return {
      totalOS: ordensFiltradas.length,
      abertas: abertas.length,
      garantia: garantia.length,
      cancelado: cancelado.length,
      andamento: andamento.length,
      finalizadas: finalizadas.length,
      faturado,
      custo,
      lucro: faturado - custo,
    };
  }, [ordensFiltradas]);

  /* =======================
     TOTAL GERAL (SEM FILTRO)
  ======================== */
 
  const totalGeral = useMemo(() => {
    const finalizadas = ordens.filter(
      (o) => o.situacao === "Finalizado"
    );

    

    const faturado = finalizadas.reduce(
      (acc, o) => acc + Number(o.valor ?? 0),
      0
    );

    const custo = finalizadas.reduce(
      (acc, o) => acc + Number(o.custo ?? 0),
      0
    );

    const totalOSMes = ordens.length;
    

    return {
      totalOSMes,
      faturado,
      custo,
      lucro: faturado - custo,
    };

  }, [ordens]);
  /* =======================
     FINALIZADAS HOJE
  ======================== */


/* =======================
   RESUMO SEMANAL (7 DIAS)
======================== */
const resumoPorMarca = useMemo(() => {
  const mapa = new Map<string, number>();

  ordens.forEach((o) => {
    const nomemarca = String(o.marca?.nome ?? "").trim();
    if (!nomemarca) return;

    mapa.set(nomemarca, (mapa.get(nomemarca) ?? 0) + 1);
  });

  return Array.from(mapa.entries()).map(([marca, quantidade]) => ({
    marca,
    quantidade,
  })); 
}, [ordens]);

const resumoSemanal = useMemo(() => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dias = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return dias.map((dia) => {
    const finalizadasDia = ordens.filter((o) => {
      if (o.situacao !== "Finalizado") return false;

      const dataOS = new Date(o.dtCriacao);
      dataOS.setHours(0, 0, 0, 0);

      return dataOS.getFullYear() === dia.getFullYear() &&
             dataOS.getMonth() === dia.getMonth() &&
             dataOS.getDate() === dia.getDate();
    });

    const faturamentodia = finalizadasDia.reduce(
      (acc, o) => acc + Number(o.valor ?? 0),
      0
    );

    return {
      dia: dia.toLocaleDateString("pt-BR", { weekday: "short" }),
      quantidade: finalizadasDia.length,
      faturamentodia: Number(faturamentodia.toFixed(2)),
    };
  });
}, [ordens]);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>

      {/* CARDS */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "100%" }}>
        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#23753e" }}>
          <Typography variant="subtitle2">OS</Typography>
          <Typography variant="h6">{resumoFiltrado.totalOS}</Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff",backgroundColor: "#4caf50" }}>
          <Typography variant="subtitle2">Abertas</Typography>
          <Typography variant="h6">{resumoFiltrado.abertas}</Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#ff9800" }}>
          <Typography variant="subtitle2">Em Andamento</Typography>
          <Typography variant="h6">{resumoFiltrado.andamento}</Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#7e27b0" }}>
          <Typography variant="subtitle2">Garantias</Typography>
          <Typography variant="h6">{resumoFiltrado.garantia}</Typography>
        </Card>

          <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#f44336" }}>
          <Typography variant="subtitle2">Cancelado</Typography>
          <Typography variant="h6">{resumoFiltrado.cancelado}</Typography>
        </Card>

        <Card sx={{ p: 1,color: "#ffffff", backgroundColor: "#1c8ef8" }}>
          <Typography variant="subtitle2">Finalizadas</Typography>
          <Typography variant="h6">{resumoFiltrado.finalizadas}</Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#000000" }}>
          <Typography variant="subtitle2">Faturamento</Typography>
          <Typography variant="h6">
            R$ {resumoFiltrado.faturado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#000000" }}>
          <Typography variant="subtitle2">Custo</Typography>
          <Typography variant="h6">
            R$ {resumoFiltrado.custo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#000000" }}>
          <Typography variant="subtitle2">Lucro</Typography>
          <Typography variant="h6">
            R$ {resumoFiltrado.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Typography>
        </Card>

        <Card sx={{ p: 1, backgroundColor: "#f3dd33", boxShadow: 1, width: "22%" }}>
  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: 13 }}>
    💰 Total de OS Finalizadas: <strong>{totalGeral.totalOSMes}</strong>
  </Typography>
  
  <Typography variant="body2">
    Faturado: <strong>
      {totalGeral.faturado.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</strong> | 
      Lucro: <strong>{totalGeral.lucro.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
    </strong>
  </Typography>
  
</Card>

        
        <Card sx={{ p: 1, width: "31%" }}>
  <Typography variant="subtitle1" gutterBottom fontSize={10}>
    📊 Faturamento dos Últimos 7 dias
  </Typography>

  <ResponsiveContainer width="100%" height={160}>
  <BarChart data={resumoSemanal}>
    <XAxis dataKey="dia" />
    <YAxis 
      padding={{ top: 20 }} 
      tickFormatter={(value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      fontSize={10}
      
      
    />
    <Tooltip 
      allowEscapeViewBox={{ x: false, y: false }}
      formatter={(value) => [value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), "Faturamento"]}
    />
    <Legend />

    <Bar 
      dataKey="faturamentodia"
      name="Faturamento (R$)"
      fill="#2e7d32"
      label={{ 
        fontSize: 10, 
        position: "top",
        fontWeight: 'bold',
        formatter: (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      }}
    />
  </BarChart>
</ResponsiveContainer>
    
  
</Card>

<Card sx={{ p: 1, width: "31%" }}>
  <Typography variant="subtitle1" gutterBottom fontSize={10}>
    📊 OS Diárias e Finalizadas dos Últimos 7 dias
  </Typography>

  <ResponsiveContainer width="100%" height={160}>
    <BarChart data={resumoSemanal}>
      <XAxis dataKey="dia" />
      <YAxis padding={{ top: 10 }} />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="quantidade"
        name="OS Finalizadas"
        fill="#1c8ef8"
        label={{ fontSize: 10, fontWeight: 'bold', position: "top"}}
      />
     
    </BarChart>
    

  </ResponsiveContainer>
  
</Card>

<Card sx={{ p: 1, width: "31%"}}>
  <Typography variant="subtitle1" gutterBottom fontSize={10}>
    📊 OS por Marca
  </Typography>

  <ResponsiveContainer width="100%" height={150}>
    <BarChart data={resumoPorMarca}>
      <XAxis dataKey="marca"/>
      <YAxis padding={{ top: 10 }} />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="quantidade"
        name="OS por Marca - Acumulado"
        fill="#a16fea"
        label={{ fontSize: 10, fontWeight: 'bold', position: "top" }}
      />
     
    </BarChart>
    

  </ResponsiveContainer>
  
</Card>
        
      </Box>
    </Box>
  );
}


