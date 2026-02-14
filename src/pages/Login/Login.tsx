import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
} from "@mui/material";
import { useState } from "react";
import { login } from "../../Services/auth";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  


  const handleLogin = async () => {
    try {
      const usuario = await login(username, senha);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      onLogin();
    } catch {
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" mb={2}>
          Login
        </Typography>

        <TextField
          label="Usuário"
          fullWidth
          size="small"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Card>
    </Box>
  );
}
