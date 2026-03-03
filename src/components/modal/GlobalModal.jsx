import { Dialog } from "@mui/material";

export default function GlobalModal({
  open,
  onClose,
  children,
  ...dialogProps
}) {
  return (
    <Dialog open={open} onClose={onClose} {...dialogProps} sx={{".css-1hp2eyy-MuiPaper-root-MuiDialog-paper": {borderRadius: '12px'}}}>
      {children}
    </Dialog>
  );
}
