import { NavLink } from "react-router-dom";

const linkStyle = {
  padding: "10px 16px",
  textDecoration: "none",
  color: "#fff",
  display: "block",
};

export default function MenuLateral() {
  return (
    <aside
      style={{
        width: 240,
        background: "#2e7d32",
        color: "#fff",
      }}
    >
      <h2 style={{ padding: 16 }}>Sistema OS</h2>

      <nav>
        <NavLink to="/" style={linkStyle}>📊 Dashboard</NavLink>

        <NavLink to="/os" style={linkStyle}>🧾 Ordens de Serviço</NavLink>
        <NavLink to="/os/nova" style={linkStyle}>➕ Nova OS</NavLink>

        <hr />

        <NavLink to="/cadastros/marca" style={linkStyle}>🏷 Marca</NavLink>
        <NavLink to="/cadastros/modelo" style={linkStyle}>📱 Modelo</NavLink>
        <NavLink to="/cadastros/servico" style={linkStyle}>🛠 Serviço</NavLink>
        <NavLink to="/cadastros/situacao" style={linkStyle}>🚦 Situação</NavLink>
      </nav>
    </aside>
  );
}
