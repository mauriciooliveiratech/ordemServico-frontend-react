import { Route, Routes } from "react-router-dom";
import { Inventory, Overview, Pos, Reports } from "../pages/Operations";
import { Usuarios } from "../pages/Usuarios";
import { useAuth } from "../contexts/useAuth";
import {OrdemServicoReal} from "../pages/OrdemServicoReal";
import {CadastrosReal} from "../pages/Cadastros/CadastrosReal";
export default function RoutesApp(){const {usuario}=useAuth(),admin=usuario?.papel==="ADMIN"||usuario?.papel==="PROPRIETARIO";return <Routes><Route path="/" element={<Overview/>}/><Route path="/ordens" element={<OrdemServicoReal/>}/><Route path="/os" element={<OrdemServicoReal/>}/><Route path="/pdv" element={<Pos/>}/><Route path="/insumos" element={<Inventory/>}/><Route path="/cadastros" element={<CadastrosReal/>}/>{admin&&<Route path="/relatorios" element={<Reports/>}/>} {admin&&<Route path="/usuarios" element={<Usuarios/>}/>}<Route path="*" element={<Overview/>}/></Routes> }
