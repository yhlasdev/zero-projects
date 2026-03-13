import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";

import tmFlag from "../../../assets/images/tm.png";
import ruFlag from "../../../assets/images/ru.png";
import gbFlag from "../../../assets/images/uk.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../hooks/useLocale";
import { useTranslation } from "react-i18next";

const languages = [
  { label: "Türkmen", flag: tmFlag, code: "tk" },
  { label: "Русский", flag: ruFlag, code: "ru" },
  { label: "English", flag: gbFlag, code: "en" },
];

export const HeaderAvatar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t, changeLang } = useLocale();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLanguageSelect = (code) => {
    changeLang(code);
    localStorage.setItem("language", code);
    handleClose();
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    navigate("/login");
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          cursor: "pointer",
          backgroundColor: open ? "action.selected" : "transparent",
          "&:hover": { backgroundColor: "action.hover" },
          userSelect: "none",
        }}
      >
        <Avatar src={""} sx={{ width: 40, height: 40 }} />

        <Box
          sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}
        >
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
            {t("common.admin")}
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1.3}>
            {t("common.administrator")}
          </Typography>
        </Box>

        {open ? (
          <KeyboardArrowUpIcon
            fontSize="small"
            sx={{ color: "text.secondary" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            fontSize="small"
            sx={{ color: "text.secondary" }}
          />
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 174,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
            mt: 0.5,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.25,
              gap: 1.5,
            },
          },
        }}
      >
        {languages.map(({ label, flag, code }) => {
          const isActive = code === currentLanguage;
          return (
            <MenuItem
              key={code}
              onClick={() => handleLanguageSelect(code)}
              sx={{
                backgroundColor: "transparent",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <ListItemIcon sx={{ minWidth: "unset !important" }}>
                <Box
                  component="img"
                  src={flag}
                  alt={label}
                  sx={{
                    width: 28,
                    height: 20,
                    borderRadius: "2px",
                    objectFit: "cover",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  variant: "body2",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "error.main",
            "& .MuiListItemIcon-root": { color: "error.main" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "unset !important" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t("common.logout")}
            onClick={handleLogout}
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
