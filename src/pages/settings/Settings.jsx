import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderAppBar from "../../components/appBar/AppBar";
import CompanyOverview from "./components/CompanyOverview";
import ContactInformation from "./components/ContactInformation";
import CompanyStructure from "./components/Structure";

import { useLocale } from "../../hooks/useLocale";

const SettingsPage = () => {
  const { t } = useLocale();
  const TABS = [
    { label: t('settings.tabs.overview'), component: <CompanyOverview /> },
    { label: t('settings.tabs.structure'), component: <CompanyStructure /> },
    { label: t('settings.tabs.contact'), component: <ContactInformation /> },
  ];

  const [tab, setTab] = useState(0);

  return (
    <Box>
      <PageTitle
        title={t('settings.title')}
        subTitle={t('settings.subtitle')}
      />

      <HeaderAppBar>
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: 48,
            "& .MuiTabs-flexContainer": {
              gap: 0.5,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 36,
              px: 2.5,
              py: 2,
              borderRadius: "8px",
              transition: "background-color 0.2s, color 0.2s",
              "&:hover": {
                backgroundColor: "#F0FDFA",
                color: "#0D3D36",
              },
            },
            "& .Mui-selected": {
              backgroundColor: "#F0FDFA",
              color: "#0D3D36 !important",
              fontWeight: 600,
            },
          }}
        >
          {TABS.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
      </HeaderAppBar>

      <Paper sx={{ p: 3 }}>{TABS[tab].component}</Paper>
    </Box>
  );
};

export default SettingsPage;
