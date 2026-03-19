import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent, // 1. Importar o tipo do evento
} from "@mui/material";

import { useEffect, useState, useCallback } from "react"; // 2. Adicionar useCallback
import { api } from "../../Services/api";
import { GraficoFaturamentoAnual } from "./GraficoFaturamentoAnual";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Marca {
  id: number;
  nome: string;
}

interface Modelo {
  id: number;
  nome: string;
}

interface FaturamentoDTO {
  mes: number;
  total: number;
}

export default function RelatoriosModal({ open, onClose }: Props) {
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [marcaId, setMarcaId] = useState<number | "">("");
  const [modeloId, setModeloId] = useState<number | "">("");

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [dados, setDados] = useState<FaturamentoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar Marcas
  useEffect(() => {
    if (open) {
      api.get("/marcas").then((res) => setMarcas(res.data));
    }
  }, [open]);

  // Carregar Modelos por Marca (e resetar modelo selecionado)
  useEffect(() => {
    if (marcaId) {
      api.get(`/modelos?marcaId=${marcaId}`).then((res) => setModelos(res.data));
    } else {
      setModelos([]);
    }
    setModeloId(""); // Limpa o modelo SEMPRE que a marca mudar
  }, [marcaId]);

  // Buscar Faturamento (Memorizada com useCallback para o useEffect não entrar em loop)
  const buscarFaturamento = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/relatorios/faturamento-anual", {
        params: {
          ano,
          marcaId: marcaId || null,
          modeloId: modeloId || null,
        },
      });
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar faturamento", error);
    } finally {
      setLoading(false);
    }
  }, [ano, marcaId, modeloId]);

  useEffect(() => {
    if (open) {
      buscarFaturamento();
    }
  }, [open, buscarFaturamento]);

  // Handlers tipados corretamente
  const handleMarcaChange = (e: SelectChangeEvent<number | "">) => {
    setMarcaId(e.target.value as number | "");
  };

  const handleModeloChange = (e: SelectChangeEvent<number | "">) => {
    setModeloId(e.target.value as number | "");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Relatórios</DialogTitle>

      <Box display="flex" gap={2} alignItems="center" px={3} pt={1}>
        {/* Filtro de Ano */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Ano</InputLabel>
          <Select 
            value={ano} 
            label="Ano" 
            onChange={(e) => setAno(Number(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Marca */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Marca</InputLabel>
          <Select 
            value={marcaId} 
            label="Marca" 
            onChange={handleMarcaChange}
          >
            <MenuItem value="">Todas</MenuItem>
            {marcas.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Modelo - Dependente da Marca */}
        <FormControl size="small" sx={{ minWidth: 160 }} disabled={!marcaId}>
          <InputLabel>Modelo</InputLabel>
          <Select 
            value={modeloId} 
            label="Modelo" 
            onChange={handleModeloChange}
          >
            <MenuItem value="">Todos</MenuItem>
            {modelos.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Faturamento Anual {loading && "(Carregando...)"}
        </Typography>

        <Box mt={3}>
          <GraficoFaturamentoAnual dados={dados} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="success">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}