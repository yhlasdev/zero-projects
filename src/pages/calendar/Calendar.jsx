import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import DateSelect from "./components/Date";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import { useState } from "react";
import HeaderButton from "../../components/buttons/Button";
import AddIcon from "@mui/icons-material/Add";
import GlobalModal from "../../components/modal/GlobalModal";
import AddEvent from "./components/AddEvent";


function CalendarPage() {
    const [view, setView] = useState('list');
    const [openAddModal, setOpenAddModal] = useState(false);

    const handleChange = (event, nextView) => {
        setView(nextView);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                <PageTitle
                    title="Company Calendar"
                    subTitle="Manage events holidays, and important dates"
                />
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <ToggleButtonGroup
                        color="primary"
                        size="small"
                        orientation="horizontal"
                        value={view}
                        exclusive
                        onChange={handleChange}
                    >
                        <ToggleButton value="list" aria-label="list">
                            Month
                        </ToggleButton>
                        <ToggleButton value="module" aria-label="module">
                            Year
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <HeaderButton
                        onClick={() => setOpenAddModal(true)}
                        icon={<AddIcon />}>
                        Add event
                    </HeaderButton>
                </Box>
            </Box>
            <DateSelect />
            <GlobalModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <AddEvent onClose={() => setOpenAddModal(false)} />
            </GlobalModal>
        </Box>
    );
};

export default CalendarPage;