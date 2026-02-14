import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ServicoPage } from "../Cadastros/ServicoPage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ServicoModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastro de Serviço</DialogTitle>
      <DialogContent>
        <ServicoPage />
      </DialogContent>
    </Dialog>
  );
}
