import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
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
  mesSelecionado,
  setMesSelecionado,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
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
    const marca = o.marca;
    if (!marca) return;

    mapa.set(marca, (mapa.get(marca) ?? 0) + 1);
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

      return dataOS.getTime() === dia.getTime();
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
    <Box sx={{ mb: 3 , p:1}}>
      {/* FILTROS */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          select
          size="small"
          label="Mês"
          value={mesSelecionado ?? ""}
          onChange={(e) =>
            setMesSelecionado(
              e.target.value === "" ? null : Number(e.target.value)
            )
          }
          sx={{ width: 150 }}
        >
          <MenuItem value="">Entre datas</MenuItem>
          {Array.from({ length: 12 }).map((_, i) => (
            <MenuItem key={i} value={i}>
              {new Date(2024, i).toLocaleString("pt-BR", { month: "long" })}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          size="small"
          label="Início"
          InputLabelProps={{ shrink: true }}
          disabled={mesSelecionado !== null}
          value={dataInicio}
          onChange={(e) => {
            setMesSelecionado(null);
            setDataInicio(e.target.value);
          }}
        />

        <TextField
          type="date"
          size="small"
          label="Fim"
          InputLabelProps={{ shrink: true }}
          disabled={mesSelecionado !== null}
          value={dataFim}
          onChange={(e) => {
            setMesSelecionado(null);
            setDataFim(e.target.value);
          }}
        />

        <Button
          variant="outlined"
          onClick={() => {
            setMesSelecionado(new Date().getMonth());
            setDataInicio("");
            setDataFim("");
          }}
        >
          Mês Atual
        </Button>
      </Box>

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
            R$ {resumoFiltrado.faturado.toFixed(2)}
          </Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#000000" }}>
          <Typography variant="subtitle2">Custo</Typography>
          <Typography variant="h6">
            R$ {resumoFiltrado.custo.toFixed(2)}
          </Typography>
        </Card>

        <Card sx={{ p: 1, color: "#ffffff", backgroundColor: "#000000" }}>
          <Typography variant="subtitle2">Lucro</Typography>
          <Typography variant="h6">
            R$ {resumoFiltrado.lucro.toFixed(2)}
          </Typography>
        </Card>

        <Card sx={{ p: 1, backgroundColor: "#e3f2fd" }}>
          <Typography variant="subtitle2">💰 Total Acumulado</Typography>
          <Typography variant="body2">
            Faturado: R$ {totalGeral.faturado.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Lucro: R$ {totalGeral.lucro.toFixed(2)}
          </Typography>
         <Typography variant="body2">Finalizadas: {totalGeral.totalOSMes}</Typography>
        </Card>

        
        <Card sx={{ p: 1, width: "31%" }}>
  <Typography variant="subtitle1" gutterBottom fontSize={10}>
    📊 Faturamento dos Últimos 7 dias
  </Typography>

  <ResponsiveContainer width="100%" height={150}>
    <BarChart data={resumoSemanal}>
      <XAxis dataKey="dia"  />
      <YAxis />
      <Tooltip/>
      <Legend />

    
      <Bar 
        dataKey="faturamentodia"
        name="Faturamento (R$)"
        fill="#2e7d32"
        label={{ fontSize: 9, position: "top" }}
      />
    </BarChart>
    

  </ResponsiveContainer>
  
</Card>

<Card sx={{ p: 1, width: "31%" }}>
  <Typography variant="subtitle1" gutterBottom fontSize={10}>
    📊 OS Diárias e Finalizadas dos Últimos 7 dias
  </Typography>

  <ResponsiveContainer width="100%" height={150}>
    <BarChart data={resumoSemanal}>
      <XAxis dataKey="dia" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="quantidade"
        name="OS Finalizadas"
        fill="#1c8ef8"
        label={{ fontSize: 9, position: "top"}}
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
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="quantidade"
        name="OS por Marca - Acumulado"
        fill="#a16fea"
        label={{ fontSize: 9, position: "top" }}
      />
     
    </BarChart>
    

  </ResponsiveContainer>
  
</Card>
        
      </Box>
    </Box>
  );
}


