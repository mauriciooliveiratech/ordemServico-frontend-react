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
import { useState } from "react";
import type { OrdemServico } from "../../types/OrdemServico";
import { api } from "../../Services/api";




interface Props {
  ordens: OrdemServico[];
  setOrdens: React.Dispatch<React.SetStateAction<OrdemServico[]>>;
  
  
}




export default function DashboardDataGrid({ ordens, setOrdens }: Props) {
  const [rowModesModel, setRowModesModel] =
    useState<GridRowModesModel>({});

  const apiRef = useGridApiRef();

  /* =======================
     CONTROLES
  ======================== */
function deletarOS(id: number) {
  const confirmar = window.confirm(
    "Tem certeza que deseja excluir esta OS?"
  );

  if (!confirmar) return;

  api.delete(`/api/os/${id}`)
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
    // ❌ NÃO chama carregarOrdens
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
     UPDATE BACKEND
  ======================== */

  const processRowUpdate = async (newRow: OrdemServico) => {
    try {
      const res = await api.put(`/api/os/${newRow.id}`, {
        numeroOS: newRow.numeroOS,
        valor: newRow.valor,
        custo: newRow.custo,
        observacao: newRow.observacao,
        situacao: newRow.situacao,
        servicoId: newRow.servicoId, // ⚠️ ID, não objeto
      });

      // 🔄 Atualiza o grid local (SEM reload)
      setOrdens((prev) =>
        prev.map((row) =>
          row.id === newRow.id ? res.data : row
        )
      );

      return res.data; // ⬅️ OBRIGATÓRIO
    } catch (error) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  };

  /* =======================
     COLUNAS
  ======================== */

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 30 },

    {
      field: "numeroOS",
      headerName: "OS",
      width: 70,
      editable: true,
    },

    {
      field: "tecnico",
      headerName: "TÉCNICO",
      width: 90,
      editable: true,
    },

    {
      field: "dtCriacao",
      headerName: "DATA LANÇAMENTO",
      width: 160,
      valueFormatter: (params) =>
        params
          ? new Date(params).toLocaleString("pt-BR")
          : "",
    },

    {
      field: "marca",
      headerName: "MARCA",
      width: 80,
    },

    {
      field: "modelo",
      headerName: "MODELO",
      width: 150,
      editable: true,
    },

    {
      field: "servico",
      headerName: "SERVIÇO",
      width: 200,
      editable: true,
     
    },

    {
      field: "observacao",
      headerName: "OBS",
      width: 200,
      editable: true,
    },

    {
      field: "valor",
      headerName: "VALOR",
      width: 90,
      type: "number",
      editable: true,
      valueFormatter: (params) =>
        `R$ ${Number(params ?? 0).toFixed(2)}`,
    },

    {
      field: "custo",
      headerName: "CUSTO",
      width: 90,
      type: "number",
      editable: true,
      valueFormatter: (params) =>
        `R$ ${Number(params ?? 0).toFixed(2)}`,
    },

   {
  field: "situacao",
  headerName: "SITUAÇÃO",
  width: 110,
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

    {
      field: "acoes",
      headerName: "AÇÕES",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        
         const isEditing =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;


        return isEditing ? (
          <>
            <IconButton  onClick={() => handleSalvar(Number(params.id))}>
              💾
            </IconButton>
            <IconButton onClick={() => handleCancelar(Number(params.id))}>
              ❌
            </IconButton>
          </>
        ) : (

          <><IconButton onClick={() => handleEditar(Number(params.id))}>
              ✏️
            </IconButton><IconButton color="error" size="small" onClick={() => deletarOS(params.row.id)}>
              🗑️
              </IconButton></>
        );
        
      },
    },
  ];

  /* =======================
     TOTAIS
  ======================== */

  

 

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
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
        />
      </div>
    </Box>
  );
}








