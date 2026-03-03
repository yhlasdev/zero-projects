import { createTheme } from "@mui/material/styles";

export const themeConfig = createTheme({
    cssVariables: {
        colorSchemeSelector: "class"
    },
    colorSchemes: {
        light: {
            palette: {
                mode: "light",
                primary: { main: "#0F3254" },
                background: { default: "#ffffff", paper: "#ffffff", secondary: "#ffffff" },
                text: { primary: "#333333", secondary: "#555555" },
            }
        },
        dark: {
            palette: {
                mode: "dark",
                primary: { main: "#ffffff" },
                background: { default: "#2F4B71", paper: "#2F4B71", secondary: "#516988" },
                text: { primary: "#ffffff", secondary: "#fff" },
            }
        }
    }
});
