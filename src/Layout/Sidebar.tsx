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
  onAbrirRelatorios: () => void;
  
}

export default function MenuTopo({
  onNovaOS,
  onAbrirMarca,
  onAbrirModelo,
  onAbrirServico,
  onAbrirRelatorios,
 
}: Props) {
  
  const [anchorRelatorios, setAnchorRelatorios] = useState<null | HTMLElement>(null);

  const [anchorCadastros, setAnchorCadastros] = useState<null | HTMLElement>(null);

  const logout = () => {
    localStorage.removeItem("usuario");
    
  };

  
  return (
    <AppBar position="static" color="success" sx={{ borderRadius: 4 }}>
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Sistema OS
        </Typography>

        {/* --- BOTÃO CADASTROS --- */}
<Button color="inherit" onClick={(e) => setAnchorCadastros(e.currentTarget)}>
  Cadastros
</Button>

<Menu
  anchorEl={anchorCadastros}
  open={Boolean(anchorCadastros)}
  onClose={() => setAnchorCadastros(null)}
>
  <MenuItem onClick={() => { onAbrirMarca(); setAnchorCadastros(null); }}>
    Marcas
  </MenuItem>
  <MenuItem onClick={() => { onAbrirModelo(); setAnchorCadastros(null); }}>
    Modelos
  </MenuItem>
  <MenuItem onClick={() => { onAbrirServico(); setAnchorCadastros(null); }}>
    Serviços
  </MenuItem>
</Menu>

| &nbsp;

{/* --- BOTÃO RELATÓRIOS --- */}
<Button color="inherit" onClick={(e) => setAnchorRelatorios(e.currentTarget)}>
  Relatórios
</Button>

<Menu
  anchorEl={anchorRelatorios}
  open={Boolean(anchorRelatorios)}
  onClose={() => setAnchorRelatorios(null)}
>
  <MenuItem onClick={() => { onAbrirRelatorios(); setAnchorRelatorios(null); }}>
    Gráfico Faturamento Anual
  </MenuItem>
</Menu>
        | &nbsp;    
        <Button color="inherit" onClick={onNovaOS}>
          Nova OS
        </Button>
        
        <Button color="inherit" onClick={logout} >
  Sair
</Button>

      </Toolbar>
    </AppBar>
  );
}




