import { Box, Tab, Tabs } from "@mui/material"
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderAppBar from "../../components/appBar/AppBar";
import { useState } from "react";



const SettingsPage = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box className=' settings'>
            <PageTitle title="Settings" subTitle="Manage company information and structure" />
            <HeaderAppBar>
                <Tabs
                    value={tab}
                    onChange={(e, val) => setTab(val)}
                >
                    <Tab label="Company Overview" />
                    <Tab label="Company Structure" />
                    <Tab label="Draft" />
                </Tabs>
            </HeaderAppBar>
        </Box>
    )
}

export default SettingsPage;