import { DataGrid } from "@mui/x-data-grid";
import {
  useGridApiRef,
  type GridColDef,
  type GridRowModesModel,
  type GridEventListener,
} from "@mui/x-data-grid";
import {
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Box, Chip, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import type { OrdemServico } from "../../types/OrdemServico";
import { api } from "../../Services/api";

interface Servico {
  id: number;
  nome: string;
}

interface Props {
  ordens: OrdemServico[];
  setOrdens: React.Dispatch<React.SetStateAction<OrdemServico[]>>;
}

export default function DashboardDataGrid({ ordens, setOrdens }: Props) {

  const [rowModesModel, setRowModesModel] =
    useState<GridRowModesModel>({});

  const [servicos, setServicos] = useState<Servico[]>([]);

  const apiRef = useGridApiRef();

  /* =======================
     CARREGAR SERVIÇOS
  ======================== */

  useEffect(() => {
    api.get("/servicos")
      .then((res) => setServicos(res.data))
      .catch((err) =>
        console.error("Erro ao carregar serviços", err)
      );
  }, []);

  /* =======================
     CONTROLES
  ======================== */

  function deletarOS(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta OS?"
    );

    if (!confirmar) return;

    api.delete(`/os/${id}`)
      .then(() => {
        setOrdens((prev) => prev.filter((o) => o.id !== id));
      })
      .catch(() => {
        alert("Erro ao deletar OS");
      });
  }

  const handleEditar = (id: number) => {
    apiRef.current?.startRowEditMode({ id });
  };

  const handleSalvar = (id: number) => {
    apiRef.current?.stopRowEditMode({ id });
  };

  const handleCancelar = (id: number) => {
    apiRef.current?.stopRowEditMode({
      id,
      ignoreModifications: true,
    });
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  /* =======================
     SALVAR NO BACKEND
  ======================== */

  const processRowUpdate = async (newRow: OrdemServico) => {
    try {
      const res = await api.put(`/os/${newRow.id}`, {
        numeroOS: newRow.numeroOS,
        valor: newRow.valor,
        custo: newRow.custo,
        observacao: newRow.observacao,
        situacao: newRow.situacao,
        servicoId: newRow.servico?.id,
      });

      setOrdens((prev) =>
        prev.map((row) =>
          row.id === newRow.id ? res.data : row
        )
      );

      return res.data;

    } catch (error) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  };

  /* =======================
     COLUNAS
  ======================== */

  const columns: GridColDef[] = [

    { field: "id", headerName: "ID", width: 25 },

    {
      field: "numeroOS",
      headerName: "OS",
      width: 60,
      editable: true,
    },

    {
      field: "usuarioId",
      headerName: "TÉCNICO",
      width: 100,
      valueGetter: (_value, row) => row.usuario?.nome || "",
    },

    {
      field: "dtCriacao",
      headerName: "DATA LANÇAMENTO",
      width: 160,
      valueGetter: (_value, row) =>
        row.dtCriacao
          ? new Date(row.dtCriacao).toLocaleString("pt-BR")
          : "",
    },

    {
      field: "marca",
      headerName: "MARCA",
      width: 90,
      valueGetter: (_value, row) => row.marca?.nome || "",
    },

    {
      field: "modelo",
      headerName: "MODELO",
      width: 120,
      valueGetter: (_value, row) => row.modelo?.nome || "",
    },

    /* =======================
       SERVIÇO (EDITÁVEL)
    ======================== */

    {
      field: "servicoId",
      headerName: "SERVIÇO",
      width: 170,
      editable: true,
      type: "singleSelect",
      valueOptions: servicos.map((s) => ({
        value: s.id,
        label: s.nome,
      })),
      valueGetter: (_value, row) => row.servico?.id ?? null,
      renderCell: (params) => params.row.servico?.nome || "",
      valueSetter: (value, row) => {
        const servicoSelecionado = servicos.find((s) => s.id === value);

        return {
          ...row,
          servico: servicoSelecionado
            ? { id: servicoSelecionado.id, nome: servicoSelecionado.nome }
            : null,
        };
      }

  },

    {
      field: "observacao",
      headerName: "OBS",
      width: 220,
      editable: true,
    },

    {
      field: "valor",
      headerName: "VALOR",
      width: 90,
      type: "number",
      editable: true,
      valueFormatter: (value) =>
        `R$ ${Number(value ?? 0).toFixed(2)}`,
    },

    {
      field: "custo",
      headerName: "CUSTO",
      width: 90,
      type: "number",
      editable: true,
      valueFormatter: (value) =>
        `R$ ${Number(value ?? 0).toFixed(2)}`,
    },

    /* =======================
       SITUAÇÃO
    ======================== */

    {
      field: "situacao",
      headerName: "SITUAÇÃO",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        "Aberto",
        "Em Andamento",
        "Finalizado",
        "Cancelado",
        "Garantia",
      ],

      renderCell: (params) => {

        const colors: Record<string, string> = {
          Aberto: "#4caf50",
          "Em Andamento": "#ff9800",
          Finalizado: "#1c8ef8",
          Cancelado: "#f44336",
          Garantia: "#7e27b0",
        };

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: colors[params.value],
              color: "#fff",
            }}
          />
        );
      },
    },

    /* =======================
       AÇÕES
    ======================== */

    {
      field: "acoes",
      headerName: "AÇÕES",
      width: 100,
      sortable: false,
      filterable: false,

      renderCell: (params) => {

        const isEditing =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        return isEditing ? (
          <>
            <IconButton onClick={() => handleSalvar(Number(params.id))}>
              💾
            </IconButton>

            <IconButton onClick={() => handleCancelar(Number(params.id))}>
              ❌
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={() => handleEditar(Number(params.id))}>
              ✏️
            </IconButton>

            <IconButton
              color="error"
              size="small"
              onClick={() => deletarOS(params.row.id)}
            >
              🗑️
            </IconButton>
          </>
        );
      },
    },
  ];

  /* =======================
     RENDER
  ======================== */

  return (
    <Box sx={{ width: "100%" }}>
      <div style={{ height: 650 }}>

        <DataGrid
          apiRef={apiRef}
          rows={ordens}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={() =>
            alert("Erro ao salvar alteração")
          }
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            sorting: {
              sortModel: [
                { field: "dtCriacao", sort: "desc" },
              ],
            },

            pagination: {
              paginationModel: {
                pageSize: 30,
                page: 0,
              },
            },
          }}
        />

      </div>
    </Box>
  );
}