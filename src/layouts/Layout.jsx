import { Box } from "@mui/material";
import { Sidebar } from "./sidebar/sidebar";
import { LayoutHeader } from "./layoutHeader/layoutHeader";
import { WrapperPageBg } from "../components/wrapperPageBg";
import { useColorScheme } from "@mui/material/styles";

const Layout = ({ children }) => {
  const { mode } = useColorScheme();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <WrapperPageBg>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <LayoutHeader />
          <Box
            sx={{
              flex: 1,
              p: 4,
              backgroundColor: mode == "dark" ? "#18212F" : "#F4F4F4",
            }}
          >
            {children}
          </Box>
        </Box>
      </WrapperPageBg>
    </Box>
  );
};

export default Layout;
