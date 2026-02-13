import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderAppBar from "../../components/appBar/AppBar";
import CompanyOverview from "./components/CompanyOverview";
import ContactInformation from "./components/ContactInformation";

const CompanyStructureTab = () => (
    <Box py={4} textAlign="center">
        <Typography color="text.secondary">Company Structure content goes here.</Typography>
    </Box>
);

const ContactInformationTab = () => (
    <Box py={4} textAlign="center">
        <Typography color="text.secondary">Contact Information content goes here.</Typography>
    </Box>
);

const TABS = [
    { label: "Company Overview", component: <CompanyOverview /> },
    { label: "Company Structure", component: <CompanyStructureTab /> },
    { label: "Contact Information", component: <ContactInformation /> },
];

const SettingsPage = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <PageTitle
                title="Company Settings"
                subTitle="Manage company information and structure"
            />

            <HeaderAppBar>
                <Tabs
                    value={tab}
                    onChange={(_, val) => setTab(val)}
                    sx={{
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            color: "text.secondary",
                            minHeight: 48,
                        },
                        "& .Mui-selected": {
                            color: "primary.main",
                            fontWeight: 600,
                        },
                        "& .MuiTabs-indicator": {
                            height: 2,
                            borderRadius: "2px 2px 0 0",
                        },
                    }}
                >
                    {TABS.map((t) => (
                        <Tab key={t.label} label={t.label} />
                    ))}
                </Tabs>
            </HeaderAppBar>

            <Box sx={{ p: 3 }} bgcolor={'#fff'}>
                {TABS[tab].component}
            </Box>
        </Box>
    );
};

export default SettingsPage;