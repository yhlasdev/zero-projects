import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useSidebarItems } from "../../hooks/useSidebarItems";
import { useLocation, useNavigate } from "react-router-dom";

import websiteLogo from '../../assets/logo/logo.png'

export const Sidebar = () => {
  const { sidebarItemsRoutes } = useSidebarItems();
  const location = useLocation();
  const navigate = useNavigate();

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
        },
      }}
    >
      <Box
        sx={{
          height: 80,
          display: "flex",
          paddingLeft: '10px',
          alignItems: "center",
          justifyContent: "start",
          gap: 2,
        }}
      >
        <Box>
          <img src={websiteLogo} />
        </Box>
        <Typography variant="h5" className=" main-color-text" >
          Yerinde
        </Typography>
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
                borderRadius: '8px',
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              <ListItemIcon>
                <Icon className={`${isActive && 'text-white'}`} />
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer >
  );
};
