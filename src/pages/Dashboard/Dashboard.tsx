/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrdemServico } from "../../types/OrdemServico";
import DashboardDataGrid from "./DashboardDataGrid";
import "./dashboard.css";
import Rodape from "../../Layout/rodape";
import DashboardCards from "./DashboardCards";
import NovaOrdemServicoModal from "./NovaOrdemServicoModal";
import MenuTopo from "../../Layout/Sidebar";
import MarcaModal from "../Cadastros/MarcaModal";
import ServicoModal from "../Cadastros/ServicoModal";
import ModeloModal from "../Cadastros/ModeloModal";
import { api } from "../../Services/api";
import RelatoriosModal from "../Relatorios/relatorioModal";
import {
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

export function Dashboard() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openMarca, setOpenMarca] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);
  const [openServico, setOpenServico] = useState(false);
  const [openRelatorios, setOpenRelatorios] = useState(false);

  /* =======================
     CARREGAR ORDENS
  ======================= */
  const carregarOrdens = useCallback(async () => {
    try {
      const res = await api.get("/os");
      setOrdens(res.data);
    } catch (err) {
      console.error("Erro ao carregar OS:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarOrdens();   
  }, [carregarOrdens]);

  /* =======================
     DATA
  ======================= */
  const dataFormatada = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  /* =======================
     FILTROS
  ======================= */
  const [periodo, setPeriodo] = useState<
    "hoje" | "semana" | "mes" | "ano" | null
  >("mes");

  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  

  /* =======================
     DATAS DO PERÍODO
  ======================= */
  const getPeriodoDatas = () => {
    const agora = new Date();
    let inicio = new Date();
    let fim = new Date();

    switch (periodo) {
      case "hoje":
        inicio = new Date();
        inicio.setHours(0, 0, 0, 0);
        fim = new Date();
        fim.setHours(23, 59, 59, 999);
        break;

      case "semana":
        { const primeiroDia = agora.getDate() - agora.getDay();
        inicio = new Date(agora.setDate(primeiroDia));
        inicio.setHours(0, 0, 0, 0);
        fim = new Date();
        break; }

      case "mes":
        inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        fim = new Date();
        break;

      case "ano":
        inicio = new Date(agora.getFullYear(), 0, 1);
        fim = new Date();
        break;

      default:
        return null;
    }
    

    return { inicio, fim };
  };



  /* =======================
     FILTRAR ORDENS
  ======================= */
  const ordensFiltradas = useMemo(() => {
    if (!ordens.length) return [];

    // 🔥 PRIORIDADE: mês selecionado
    if (mesSelecionado !== null) {
      const ano = new Date().getFullYear();
      const inicio = new Date(ano, mesSelecionado, 1);
      const fim = new Date(ano, mesSelecionado + 1, 0, 23, 59, 59);

      return ordens.filter((o) => {
        const data = new Date(o.dtCriacao);
        return data >= inicio && data <= fim;
      });
    }

    // 🔥 SENÃO usa botões
    const periodoDatas = getPeriodoDatas();
    if (!periodoDatas) return ordens;

    return ordens.filter((o) => {
      const data = new Date(o.dtCriacao);
      return data >= periodoDatas.inicio && data <= periodoDatas.fim;
    });
  }, [ordens, mesSelecionado, getPeriodoDatas]);

  /* =======================
     RENDER
  ======================= */
  return (
    <>
      <MenuTopo
        onNovaOS={() => setOpenModal(true)}
        onAbrirMarca={() => setOpenMarca(true)}
        onAbrirModelo={() => setOpenModelo(true)}
        onAbrirServico={() => setOpenServico(true)}
        onAbrirRelatorios={() => setOpenRelatorios(true)}
      />

      <RelatoriosModal
        open={openRelatorios}
        onClose={() => setOpenRelatorios(false)}
      />

      <main style={{ padding: 10 }}>

        {/* DATA */}
        <Typography variant="subtitle2" color="text.secondary">
          Hoje
        </Typography>

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textTransform: "capitalize", mb: 2 }}
        >
          {dataFormatada}
        </Typography>

        {/* 🔥 FILTROS */}
        <Stack direction="row" spacing={2} mb={2} alignItems="center">

          {/* BOTÕES */}
          <Button
            variant={periodo === "hoje" ? "contained" : "outlined"}
            onClick={() => {
              setPeriodo("hoje");
              setMesSelecionado(null);
            }}
          >
            Hoje
          </Button>

          <Button
            variant={periodo === "semana" ? "contained" : "outlined"}
            onClick={() => {
              setPeriodo("semana");
              setMesSelecionado(null);
            }}
          >
            Semana
          </Button>

          <Button
            variant={periodo === "mes" ? "contained" : "outlined"}
            onClick={() => {
              setPeriodo("mes");
              setMesSelecionado(null);
            }}
          >
            Mês
          </Button>

          <Button
            variant={periodo === "ano" ? "contained" : "outlined"}
            onClick={() => {
              setPeriodo("ano");
              setMesSelecionado(null);
            }}
          >
            Ano
          </Button>

          {/* 🔥 SELECT DE MÊS */}
          <Select
            displayEmpty
            value={mesSelecionado ?? ""}
            onChange={(e) => {
              setMesSelecionado(
                e.target.value === "" ? null : Number(e.target.value)
              );
              setPeriodo(null);
            }}
            size="small"
          >
            <MenuItem value="">Selecionar mês</MenuItem>
            <MenuItem value={0}>Janeiro</MenuItem>
            <MenuItem value={1}>Fevereiro</MenuItem>
            <MenuItem value={2}>Março</MenuItem>
            <MenuItem value={3}>Abril</MenuItem>
            <MenuItem value={4}>Maio</MenuItem>
            <MenuItem value={5}>Junho</MenuItem>
            <MenuItem value={6}>Julho</MenuItem>
            <MenuItem value={7}>Agosto</MenuItem>
            <MenuItem value={8}>Setembro</MenuItem>
            <MenuItem value={9}>Outubro</MenuItem>
            <MenuItem value={10}>Novembro</MenuItem>
            <MenuItem value={11}>Dezembro</MenuItem>
          </Select>

        </Stack>

        {/* CARDS */}
        <DashboardCards
          ordens={ordens}
          ordensFiltradas={ordensFiltradas}
          mesSelecionado={mesSelecionado}
          setMesSelecionado={setMesSelecionado}
          dataInicio={""}
          setDataInicio={() => {}}
          dataFim={""}
          setDataFim={() => {}}
        />

        {/* GRID */}
        <DashboardDataGrid
          ordens={ordensFiltradas}
          setOrdens={setOrdens}
        />
      </main>

      {/* MODAIS */}
      <NovaOrdemServicoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          carregarOrdens();
        }}
      />

      <MarcaModal open={openMarca} onClose={() => setOpenMarca(false)} />
      <ModeloModal open={openModelo} onClose={() => setOpenModelo(false)} />
      <ServicoModal open={openServico} onClose={() => setOpenServico(false)} />

      <Rodape />
    </>
  );
}