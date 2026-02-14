import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside style={{ width: 220, background: "#1f2937", color: "#fff"}}>
            <h3 style={{ padding: 16}}>Ordem de Serviço</h3>
            <nav>
                <ul style={{ listStyle: "none", padding: 0}}>
                    <li><Link to="/" style={link}>Dashboard</Link></li>
                    <li><Link to="/os/nova" style={link}>Nova OS</Link></li>
                    <li><Link to="/usuarios" style={link}>Usuários</Link></li>
                    <li><Link to="/marcas" style={link}>Marcas</Link></li>
                    <li><Link to="/modelos" style={link}>Modelos</Link></li>
                    <li><Link to="/servicos" style={link}>Serviços</Link></li>
                    <li><Link to="/situacoes" style={link}>Situações</Link></li>
                </ul>
            </nav>
        </aside>
    );
}

const link = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    padding: "10px 16px"
};