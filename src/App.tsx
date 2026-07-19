import { Box,CircularProgress,createTheme,ThemeProvider } from "@mui/material";
import { Navigate,Route,Routes,useLocation,useNavigate } from "react-router-dom";
import Sidebar from "./Layout/Sidebar";
import { useAuth } from "./contexts/useAuth";
import { Login } from "./pages/Login";
import { CadastroEmpresa } from "./pages/CadastroEmpresa";
import RoutesApp from "./routes";
const theme=createTheme({palette:{primary:{main:"#238b63"},success:{main:"#238b63"},background:{default:"#f3f6f4"}},typography:{fontFamily:'Inter, ui-sans-serif, system-ui, sans-serif'},shape:{borderRadius:10},components:{MuiButton:{defaultProps:{disableElevation:true},styleOverrides:{root:{textTransform:"none",fontWeight:700,borderRadius:8}}},MuiPaper:{styleOverrides:{root:{backgroundImage:"none"}}}}});
function Sistema(){const {sessao,loading}=useAuth(),location=useLocation(),navigate=useNavigate();if(loading)return <Box sx={{height:"100vh",display:"grid",placeItems:"center"}}><CircularProgress/></Box>;if(!sessao)return <Navigate to="/login" state={{from:location.pathname}} replace/>;return <Sidebar onNovaOS={()=>navigate("/ordens")}><RoutesApp/></Sidebar>}
export default function App(){return <ThemeProvider theme={theme}><Routes><Route path="/login" element={<Login/>}/><Route path="/cadastro" element={<CadastroEmpresa/>}/><Route path="*" element={<Sistema/>}/></Routes></ThemeProvider>}
