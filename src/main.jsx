import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { themeConfig } from './libs/theme.js';

import i18n from './libs/i18n';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { GlobalStyles } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';

import "@fontsource/inter";
import "@fontsource-variable/inter";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 30 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <StyledEngineProvider enableCssLayer>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <ThemeProvider theme={themeConfig}>
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </I18nextProvider>
    </QueryClientProvider>
  </HelmetProvider>
)
