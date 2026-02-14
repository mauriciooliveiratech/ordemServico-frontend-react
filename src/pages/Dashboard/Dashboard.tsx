import { useEffect, useMemo, useState } from "react";
import { api } from "../../Services/api";
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

const usuario = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

export function Dashboard() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openMarca, setOpenMarca] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);
  const [openServico, setOpenServico] = useState(false);
  

  /* =======================
     FILTROS (CENTRALIZADOS)
  ======================== */
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(
    new Date().getMonth()
  );
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  
  const carregarOrdens = () => {
  if (!usuario?.id) return;

  if (usuario.perfil === "ADMIN") {
    api.get("/api/os")
      .then(res => setOrdens(res.data))
      .catch(console.error);
  } else {
    api.get(`/api/os?usuarioId=${usuario.id}`)
      .then(res => setOrdens(res.data))
      .catch(console.error);
  }
};

  useEffect(() => {
    carregarOrdens();
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
      const data = new Date(o.dtCriacao);
      return data >= inicio! && data <= fim!;
    });
  }, [ordens, mesSelecionado, dataInicio, dataFim]);

  return (
    <>
      <MenuTopo onNovaOS={() => setOpenModal(true)}
      onAbrirMarca={() => setOpenMarca(true)}
  onAbrirModelo={() => setOpenModelo(true)}
  onAbrirServico={() => setOpenServico(true)} />

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
        open={openModal} onClose={() => setOpenModal(false)}
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



