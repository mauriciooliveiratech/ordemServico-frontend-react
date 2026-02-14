import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { MarcaPage } from "../Cadastros/MarcaPage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MarcaModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastro de Marca</DialogTitle>
      <DialogContent>
        <MarcaPage />
      </DialogContent>
    </Dialog>
  );
}
