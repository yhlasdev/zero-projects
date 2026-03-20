import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { useSidebarItems } from "../../hooks/useSidebarItems";
import { useLocation, useNavigate } from "react-router-dom";

import websiteLogo from "../../assets/logo/last_logo.png";

import websiteLogoDarkMode from '../../assets/logo/logo_dark_mode.png'

import { useColorScheme } from "@mui/material";

export const Sidebar = () => {
  const { sidebarItemsRoutes } = useSidebarItems();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useColorScheme();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          position: "fixed",
          height: "100vh",
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          height: 100,
          display: "flex",
          paddingLeft: "30px",
          alignItems: "center",
          justifyContent: "start",
          gap: 2,
        }}
      >
        {
          mode === 'dark' ? <img style={{ width: '96px', height: '71px' }} src={websiteLogoDarkMode} /> : <img style={{ width: '96px', height: '71px' }} src={websiteLogo} />
        }
      </Box>

      <Divider />

      <List sx={{ p: 1 }}>
        {sidebarItemsRoutes.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === `/${item.routeKey}`;
          return (
            <ListItemButton
              key={item.id}
              selected={isActive}
              onClick={() => navigate(`/${item.routeKey}`)}
              sx={{
                mb: 1,
                borderRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: mode === "dark" ? "primary.light" : "primary.dark",
                },
              }}
            >
              <ListItemIcon>
                <Icon className={`${isActive && "text-[#eeeeee]"}`} />
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};
