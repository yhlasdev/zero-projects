import { Backdrop, CircularProgress } from "@mui/material";

export default function GlobalLoader({ open = false }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}