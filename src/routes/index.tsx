import { Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { MarcaPage } from "../pages/Cadastros/MarcaPage";
import { ModeloPage } from "../pages/Cadastros/ModeloPage";
import { ServicoPage } from "../pages/Cadastros/ServicoPage";


export default function RoutesApp() {
  return (
    <Routes>
    

      <Route path="/" element={<Dashboard />} />
      <Route path="/os" element={<Dashboard />} />
      <Route path="/Cadastros/marcapage" element={<MarcaPage />} />
      <Route path="/Cadastros/modelopage" element={<ModeloPage />} />
      <Route path="/Cadastros/servicopage" element={<ServicoPage />} />
      
    </Routes>
  );
}

