import { AppBar, Toolbar } from "@mui/material";

export default function HeaderAppBar({ children }) {
  return (
    <AppBar
      position="static"
      sx={{
        paddingTop: 1.5,
        paddingBottom: 1.5,
        marginTop: 2,
        backgroundColor: "#fff",
        borderRadius: "10px 10px 0 0",
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        {children}
      </Toolbar>
    </AppBar>
  );
}
