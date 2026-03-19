import {useCallback, useEffect, useMemo, useState} from "react";
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


export function Dashboard() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openMarca, setOpenMarca] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);
  const [openServico, setOpenServico] = useState(false);
  const [openRelatorios, setOpenRelatorios] = useState(false);
  
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
     FILTROS (CENTRALIZADOS)
  ======================== */
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(
    new Date().getMonth()
  );
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    api.get("/os")
      .then(res => setOrdens(res.data))
      .catch(err => console.error("Erro ao carregar OS:", err));
      
  }, []);


  /* =======================
     ORDENS FILTRADAS
  ======================== */
  const ordensFiltradas = useMemo(() => {
    if (!ordens.length) return [];

    let inicio: Date | null = null;
    let fim: Date | null = null;

    if (mesSelecionado !== null) {
      const ano = new Date().getFullYear();
      inicio = new Date(ano, mesSelecionado, 1);
      fim = new Date(ano, mesSelecionado + 1, 0, 23, 59, 59);
    } else if (dataInicio && dataFim) {
      inicio = new Date(dataInicio);
      fim = new Date(dataFim);
      fim.setHours(23, 59, 59);
    }

    if (!inicio || !fim) return ordens;

    return ordens.filter((o) => {
      const criacao = new Date(o.dtCriacao);
      return criacao >= inicio! && criacao <= fim!;
    });
  }, [ordens, mesSelecionado, dataInicio, dataFim]);

  return (
    <>
      <MenuTopo onNovaOS={() => setOpenModal(true)}
      onAbrirMarca={() => setOpenMarca(true)}
      onAbrirModelo={() => setOpenModelo(true)}
      onAbrirServico={() => setOpenServico(true)} onAbrirRelatorios={() => setOpenRelatorios(true)} />

  <RelatoriosModal
          open={openRelatorios}
          onClose={() => setOpenRelatorios(false)}
        />

      <main style={{ padding: 10 }}>
        {/* CARDS CONTROLAM FILTRO */}
        <DashboardCards
          ordens={ordens}
          ordensFiltradas={ordensFiltradas}
          mesSelecionado={mesSelecionado}
          setMesSelecionado={setMesSelecionado}
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
        />

        {/* GRID REAGE AO FILTRO */}
        <DashboardDataGrid
          ordens={ordensFiltradas}
          setOrdens={setOrdens}
        />
      </main>

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


