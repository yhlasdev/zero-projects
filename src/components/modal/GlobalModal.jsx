import { Dialog } from "@mui/material";

export default function GlobalModal({
  open,
  onClose,
  children,
  width,
  ...dialogProps
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={width ? false : dialogProps.maxWidth}
      {...dialogProps}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          ...(width && {
            width: `${width}px`,
            maxWidth: "none",
          }),
        },
      }}
    >
      {children}
    </Dialog>
  );
}
