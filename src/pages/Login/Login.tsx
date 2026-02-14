import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export function Login() {
    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        try {
            login("token-de-exemplo");
            navigate("/");
        } catch {
            alert("Falha na autenticação");
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Usuário"
            />
            <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Senha"
            />
            <button type="submit">Entrar</button>
        </form>
    );
}
    