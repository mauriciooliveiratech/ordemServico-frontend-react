import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../../Services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Option {
  id: number;
  nome: string;
}

export default function NovaOrdemServicoModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    numeroOS: "",
    usuarioId: 2,
    marcaId: "",
    modeloId: "",
    servicoId: "",
    observacao: "",
    valor: "",
    custo: "",
    situacao: "Aberto",
  });

  const [marcas, setMarcas] = useState<Option[]>([]);
  const [modelos, setModelos] = useState<Option[]>([]);
  const [servicos, setServicos] = useState<Option[]>([]);

  /* =======================
     LOAD INICIAL
  ======================== */
  useEffect(() => {
    api.get("/api/marcas").then((res) => setMarcas(res.data));
    api.get("/api/servicos").then((res) => setServicos(res.data));
  }, []);

  /* =======================
     CARREGAR MODELOS POR MARCA
  ======================== */
  useEffect(() => {
    if (!form.marcaId) return;

    api
      .get(`/api/modelos?marcaId=${form.marcaId}`)
      .then((res) => setModelos(res.data));
  }, [form.marcaId]);

  /* =======================
     HANDLERS
  ======================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 👇 quando muda a marca, limpa modelo e lista de modelos
    if (name === "marcaId") {
      setForm((prev) => ({
        ...prev,
        marcaId: value,
        modeloId: "",
      }));
      setModelos([]);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    try {
      await api.post("/api/os", {
        numeroOS: form.numeroOS,
        usuarioId: Number(form.usuarioId),
        marcaId: Number(form.marcaId),
        modeloId: Number(form.modeloId),
        servicoId: Number(form.servicoId),
        observacao: form.observacao,
        valor: Number(form.valor || 0),
        custo: Number(form.custo || 0),
        situacao: form.situacao,
      });

      onSuccess(); // 🔄 atualiza grid automaticamente
      onClose();   // ❌ fecha modal
    } catch (err) {
      console.error("Erro ao salvar OS", err);
      alert("Erro ao salvar Ordem de Serviço");
    }
  };

  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nova Ordem de Serviço</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid size={6}>
            <TextField
              label="Número OS"
              name="numeroOS"
              fullWidth
              value={form.numeroOS}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={6}>
            <TextField label="Técnico" fullWidth value="Maurício" disabled />
          </Grid>

          <Grid size={4}>
            <TextField
              select
              label="Marca"
              name="marcaId"
              fullWidth
              value={form.marcaId}
              onChange={handleChange}
            >
              {marcas.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <DialogActions>
        
        
      </DialogActions>

          <Grid size={4}>
            <TextField
              select
              label="Modelo"
              name="modeloId"
              fullWidth
              value={form.modeloId}
              onChange={handleChange}
              disabled={!form.marcaId}
            >
              {modelos.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={4}>
            <TextField
              select
              label="Serviço"
              name="servicoId"
              fullWidth
              value={form.servicoId}
              onChange={handleChange}
            >
              {servicos.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField
              label="Observação"
              name="observacao"
              fullWidth
              multiline
              rows={2}
              value={form.observacao}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Valor"
              name="valor"
              type="number"
              fullWidth
              value={form.valor}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Custo"
              name="custo"
              type="number"
              fullWidth
              value={form.custo}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              select
              fullWidth
              label="Situação"
              name="situacao"
              value={form.situacao}
              onChange={handleChange}
            >
              <MenuItem value="Aberto">Aberto</MenuItem>
              <MenuItem value="Em Andamento">Em Andamento</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="success" onClick={handleSalvar}>
          Salvar OS
        </Button>
      </DialogActions>
    </Dialog>
  );
}




