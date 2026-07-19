import { Route, Routes } from "react-router-dom";
import { Inventory, Orders, Overview, Pos, Registrations, Reports } from "../pages/Operations";
import { Usuarios } from "../pages/Usuarios";
import { useAuth } from "../contexts/useAuth";
export default function RoutesApp(){const {usuario}=useAuth(),admin=usuario?.papel==="ADMIN"||usuario?.papel==="PROPRIETARIO";return <Routes><Route path="/" element={<Overview/>}/><Route path="/ordens" element={<Orders/>}/><Route path="/os" element={<Orders/>}/><Route path="/pdv" element={<Pos/>}/><Route path="/insumos" element={<Inventory/>}/><Route path="/cadastros" element={<Registrations/>}/>{admin&&<Route path="/relatorios" element={<Reports/>}/>} {admin&&<Route path="/usuarios" element={<Usuarios/>}/>}<Route path="*" element={<Overview/>}/></Routes> }
