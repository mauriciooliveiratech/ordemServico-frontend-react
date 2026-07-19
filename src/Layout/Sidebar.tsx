import { Add, AssessmentOutlined, BuildOutlined, CategoryOutlined, DashboardOutlined, Inventory2Outlined, LogoutOutlined, Menu as MenuIcon, PeopleOutline, PointOfSaleOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const drawerWidth = 248;

const baseItems = [
  { label: "Visão geral", path: "/", icon: <DashboardOutlined /> },
  { label: "Ordens de serviço", path: "/ordens", icon: <BuildOutlined /> },
  { label: "PDV / Vendas", path: "/pdv", icon: <PointOfSaleOutlined /> },
  { label: "Insumos e estoque", path: "/insumos", icon: <Inventory2Outlined /> },
  { label: "Cadastros", path: "/cadastros", icon: <CategoryOutlined /> },
  { label: "Relatórios", path: "/relatorios", icon: <AssessmentOutlined /> },
];

export default function Sidebar({ children, onNovaOS }: { children: React.ReactNode; onNovaOS?: () => void }) {
  const {usuario,empresa,logout}=useAuth();
  const admin=usuario?.papel==="ADMIN"||usuario?.papel==="PROPRIETARIO";
  const items=admin?[...baseItems,{label:"Usuários e técnicos",path:"/usuarios",icon:<PeopleOutline/>}]:baseItems.filter(i=>i.path!=="/relatorios");
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const page = items.find((item) => item.path === location.pathname)?.label ?? "Visão geral";

  const content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#0d3b2e", color: "white" }}>
      <Box sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, bgcolor: "#22a06b", borderRadius: 2, display: "grid", placeItems: "center" }}><BuildOutlined /></Box>
        <Box><Typography fontWeight={800} fontSize={18}>Oficina OS</Typography><Typography fontSize={11} sx={{ opacity: .65 }}>GESTÃO INTELIGENTE</Typography></Box>
      </Box>
      <Button onClick={onNovaOS} startIcon={<Add />} variant="contained" sx={{ mx: 2, mb: 2, bgcolor: "#28a873", boxShadow: "none", py: 1.15, '&:hover': { bgcolor: "#218d61" } }}>Nova ordem</Button>
      <List sx={{ px: 1.5 }}>
        {items.map((item) => <ListItemButton key={item.path} component={NavLink} to={item.path} onClick={() => setOpen(false)} selected={location.pathname === item.path} sx={{ borderRadius: 2, mb: .5, color: "rgba(255,255,255,.72)", '&.Mui-selected': { bgcolor: "rgba(255,255,255,.12)", color: "white" }, '&.Mui-selected:hover': { bgcolor: "rgba(255,255,255,.15)" } }}><ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon><ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} /></ListItemButton>)}
      </List>
      <Box sx={{ mt: "auto", px: 2, pb: 2 }}><Divider sx={{ borderColor: "rgba(255,255,255,.12)", mb: 2 }} /><Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}><Avatar sx={{ width: 36, height: 36, bgcolor: "#d9f3e8", color: "#176347", fontSize: 14 }}>{usuario?.nome?.split(" ").map(n=>n[0]).slice(0,2).join("")}</Avatar><Box sx={{ minWidth: 0 }}><Typography fontSize={13} fontWeight={700} noWrap>{usuario?.nome}</Typography><Typography fontSize={11} sx={{ opacity: .6 }}>{admin?"Administrador":"Técnico"}</Typography></Box><IconButton title="Sair" onClick={logout} sx={{ ml: "auto", color:"rgba(255,255,255,.6)" }}><LogoutOutlined fontSize="small"/></IconButton></Box></Box>
    </Box>
  );

  return <Box sx={{ minHeight: "100vh", bgcolor: "#f3f6f4" }}>
    {mobile ? <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: drawerWidth } }}>{content}</Drawer> : <Drawer variant="permanent" PaperProps={{ sx: { width: drawerWidth, border: 0 } }}>{content}</Drawer>}
    <Box sx={{ ml: mobile ? 0 : `${drawerWidth}px` }}>
      <Box component="header" sx={{ height: 72, bgcolor: "white", borderBottom: "1px solid #e6ebe8", px: { xs: 2, md: 4 }, display: "flex", alignItems: "center", gap: 2 }}>
        {mobile && <IconButton onClick={() => setOpen(true)}><MenuIcon /></IconButton>}
        <Box><Typography fontWeight={800} fontSize={20} color="#173b30">{page}</Typography><Typography color="text.secondary" fontSize={12}>Controle completo da sua operação</Typography></Box>
        <TextField select size="small" value={empresa?.id||""} sx={{ ml:"auto", minWidth:{xs:130,md:210}, '& .MuiOutlinedInput-root':{bgcolor:"#f7faf8"} }}>
          <MenuItem value={empresa?.id||""}>{empresa?.nome||"Minha empresa"}</MenuItem>
        </TextField>
        <Box sx={{ display:{xs:"none",sm:"block"}, px: 1.5, py: .65, bgcolor: "#e8f6ef", color: "#18734f", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>● {admin?"Administrador":"Técnico"}</Box>
      </Box>
      <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1500, mx: "auto" }}>{children}</Box>
    </Box>
  </Box>;
}
