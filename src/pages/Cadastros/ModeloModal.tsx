import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ModeloPage } from "../Cadastros/ModeloPage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModeloModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastro de Modelo</DialogTitle>
      <DialogContent>
        <ModeloPage />
      </DialogContent>
    </Dialog>
  );
}
