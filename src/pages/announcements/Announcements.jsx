import React, { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderButton from "../../components/buttons/Button";
import AddIcon from "@mui/icons-material/Add";
import HeaderAppBar from "../../components/appBar/AppBar";
import AnnouncementContent from "./components/AnnouncementContent";
import GlobalModal from "../../components/modal/GlobalModal";

const statusColors = {
    Published: { bg: "#DCFCE7", color: "#15803D" },
    Draft: { bg: "#E5E7EB", color: "#374151" },
};

// ✅ Local data
const announcements = [
    { id: 1, title: "Company Holiday Schedule 2024", author: "Amanda White", date: "2024-01-20", audience: "All employees", status: "Published", read: "128 / 142" },
    { id: 2, title: "New Health Insurance Benefits", author: "Amanda White", date: "2024-01-18", audience: "All employees", status: "Published", read: "135 / 142" },
    { id: 3, title: "Engineering Team Meeting - Q1 Planning", author: "David Wilson", date: "2024-01-22", audience: "Engineering", status: "Published", read: "42 / 48" },
    { id: 4, title: "Office Renovation Notice", author: "Facilities Team", date: "2024-01-15", audience: "All employees", status: "Published", read: "140 / 142" },
    { id: 5, title: "Sales Performance Review Guidelines", author: "Robert Martinez", date: "2024-01-23", audience: "Sales", status: "Draft", read: "0 / 32" },
    { id: 6, title: "New Employee Onboarding Session", author: "Amanda White", date: "2024-01-19", audience: "HR, New Hires", status: "Published", read: "18 / 20" },
];

const AnnouncementsPage = () => {
    const [tab, setTab] = useState(0);
    const [isModal, setModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);


    const filteredAnnouncements = announcements.filter((item) => {
        if (tab === 1) return item.status === "Published";
        if (tab === 2) return item.status === "Draft";
        return true; // All
    });

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <PageTitle title="Announcements" subTitle="Manage company announcements" />
                <HeaderButton onClick={() => {
                    setSelectedAnnouncement(null);
                    setModal(true);
                }}
                    width={220} icon={<AddIcon />}>
                    New Announcement
                </HeaderButton>
            </Box>

            {/* Tabs */}
            <HeaderAppBar>
                <Tabs
                    value={tab}
                    onChange={(e, val) => setTab(val)}
                >
                    <Tab label="All" />
                    <Tab label="Published" />
                    <Tab label="Draft" />
                </Tabs>
            </HeaderAppBar>

            {/* Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Target Audience</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Read Stats</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ bgcolor: '#fff' }}>
                    {filteredAnnouncements.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.author}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.audience}</TableCell>
                            <TableCell>
                                <Chip
                                    label={item.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: statusColors[item.status].bg,
                                        color: statusColors[item.status].color,
                                        fontWeight: 500,
                                    }}
                                />
                            </TableCell>
                            <TableCell>{item.read}</TableCell>
                            <TableCell>
                                <IconButton size="small"><VisibilityIcon /></IconButton>
                                <IconButton size="small"
                                    onClick={() => {
                                        setSelectedAnnouncement(item);
                                        setModal(true);
                                    }}
                                ><EditIcon /></IconButton>
                                <IconButton size="small"><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <GlobalModal
                open={isModal}
                onClose={() => {
                    setModal(false);
                    setSelectedAnnouncement(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <AnnouncementContent
                    data={selectedAnnouncement}
                    onClose={() => {
                        setModal(false);
                        setSelectedAnnouncement(null);
                    }}
                />
            </GlobalModal>


        </Box>
    );
};

export default AnnouncementsPage;
