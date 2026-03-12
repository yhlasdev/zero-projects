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
                background: { default: "#FFFFFF", paper: "#ffffff", secondary: "#ffffff" },
                text: { primary: "#333333", secondary: "#555555" },
            }
        },
        dark: {
            palette: {
                mode: "dark",
                primary: { main: "#1d2c44" },
                background: { default: "#18212F", paper: "#1F2937" },
                text: { primary: "#ffffff", secondary: "#fff" },
            }
        }
    }
});
