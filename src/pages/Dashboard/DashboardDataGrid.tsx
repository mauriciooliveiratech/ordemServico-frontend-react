import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { Box } from "@mui/system";
import type { OrdemServico } from "../../types/OrdemServico";
import { useMemo } from "react";


type Props = {
  ordens: OrdemServico[];
};

export default function DashboardDataGrid({ ordens }: Props) {
  const columns: GridColDef[] = [
   
    { field: "id", headerName: "ID", width: 50 },

    { field: "numeroOS", headerName: "OS", width: 70 },

    {
      field: "tecnico",
      headerName: "TÉCNICO",
      width: 90,
      valueGetter: (_, row) => row.tecnico ?? "",
    },

    {
      field: "dtCriacao",
      headerName: "DATA LANÇAMENTO",
      width: 165,
      valueGetter: (_, row) =>
        row.dtCriacao
          ? new Date(row.dtCriacao).toLocaleString("pt-BR")
          : "",
    },

    {
      field: "marca",
      headerName: "MARCA",
      width: 100,
      valueGetter: (_, row) => row.marca ?? "",
    },

    {
      field: "modelo",
      headerName: "MODELO",
      width: 150,
      valueGetter: (_, row) => row.modelo ?? "",
    },

    {
      field: "servico",
      headerName: "SERVIÇO",
      width: 200,
      valueGetter: (_, row) => row.servico ?? "",
    },

    
    {
      field: "observacao",
      headerName: "OBS",
      width: 150,
      valueGetter: (_, row) => row.observacao ?? "",
      renderCell: (params) => {
        const value = String(params.value ?? "");
        return <span>{value}</span>;
      },
    },

    {
      field: "valor",
      headerName: "VALOR",
      width: 100,
      type: "number",
      valueFormatter: (params) => 
        `R$ ${Number(params ?? 0).toFixed(2)}`,
    },
    
    {
  field: "custo",
  headerName: "CUSTO",
  width: 100,
  type: "number",
  valueFormatter: (params) =>
    `R$ ${Number(params ?? 0).toFixed(2)}`
   },

    {
      field: "situacao",
      headerName: "SITUAÇÃO",
      width: 110,
      renderCell: (params) => {
        const value = String(params.value ?? "");

        let color: "success" | "warning" | "info" | "error" | "default" = "default";

        if (value === "Aberto") color = "info";
        if (value === "Em Andamento") color = "warning";
        if (value === "Finalizado") color = "success";
        if (value === "Cancelado") color = "error";

        return <Chip label={value} color={color} size="small" />;
      }
    },

    {
      field: "acoes",
      headerName: "AÇÕES",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <button title="Ver">👁</button>
          <button title="Editar">✏️</button>
        </Box>
      ),
    },
  ];
   // 🔹 Totalizador
  const totalFinalizado = useMemo(() => {
  return ordens
    .filter(os => os.situacao === "Finalizado")
    .reduce((total, os) => total + (os.valor ?? 0), 0);
}, [ordens]);

  const totalCusto = useMemo(() => {
    return ordens
    .filter(os => os.situacao === "Finalizado")
    .reduce((acc, os) => acc + Number(os.custo ?? 0), 0);
  }, [ordens]);

  return (
    <Box sx={{  width: "100%"}}>
      <div style={{height: 510, width: "100%"}}>
        <DataGrid
        
          rows={ordens}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } }
          }}
          disableRowSelectionOnClick
        />
      </div>

    {/* 🔹 Rodapé com total */}
      <Box
        sx={{
          marginTop: 2,
          padding: 1,
          background: "#2e7d32",
          color: "#fff",
          textAlign: "right",
          borderRadius: 1,
          fontFamily: "Arial",
        }}
      >
        Total Faturado: R$ {totalFinalizado.toFixed(2)} &nbsp; | &nbsp;
        Total Custo: R$ {totalCusto.toFixed(2)}
      </Box>
      <Box
        sx={{
          marginTop: 2,
          padding: 1,
          background: "#2e7d32",
          color: "#fff",
          fontWeight: "bold",
          textAlign: "right",
          borderRadius: 1,
          fontFamily: "Arial",
        }}
      >
        
        Lucro Liquido: R$ {(totalFinalizado - totalCusto).toFixed(2)}
      </Box>
    </Box>
  );
}
