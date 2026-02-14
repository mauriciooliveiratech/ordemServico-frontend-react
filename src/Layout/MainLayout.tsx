import { Outlet } from "react-router-dom";
//import MenuLateral from "../components/MenuLateral";


export default function MainLayout() {
  return (
    <div style={{ display: "flex", height: "200vh" }}>
      

      <main style={{ flex: 1, padding: 20, background: "#f5f5f5" }}>
        <Outlet />
      </main>
    </div>
  );
}
