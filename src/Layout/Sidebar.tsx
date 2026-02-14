import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

interface Props {
  onNovaOS: () => void;
  onAbrirMarca: () => void;
  onAbrirModelo: () => void;
  onAbrirServico: () => void;
}

export default function MenuTopo({
  onNovaOS,
  onAbrirMarca,
  onAbrirModelo,
  onAbrirServico,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const logout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/Login";
  };

  return (
    <AppBar position="static" color="success" sx={{ borderRadius: 4 }}>
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Sistema OS
        </Typography>

        {/* CADASTROS */}
        <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
          Cadastros
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              onAbrirMarca();
              setAnchorEl(null);
            }}
          >
            Marcas
          </MenuItem>

          <MenuItem
            onClick={() => {
              onAbrirModelo();
              setAnchorEl(null);
            }}
          >
            Modelos
          </MenuItem>

          <MenuItem
            onClick={() => {
              onAbrirServico();
              setAnchorEl(null);
            }}
          >
            Serviços
          </MenuItem>
        </Menu>

        | &nbsp;

        <Button color="inherit" onClick={onNovaOS}>
          Nova OS
        </Button>
        <Button color="inherit" onClick={logout}>
  Sair
</Button>

      </Toolbar>
    </AppBar>
  );
}




