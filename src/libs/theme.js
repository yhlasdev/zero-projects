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
                primary: { main: "#1F2937" },
                background: { default: "#1F2937", paper: "#1F2937", secondary: "#516988" },
                text: { primary: "#ffffff", secondary: "#fff" },
            }
        }
    }
});
