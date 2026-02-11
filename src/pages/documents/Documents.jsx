import React, { useState } from "react";
import { Box, Divider, Grid, IconButton, Typography, Button } from "@mui/material";

import { PageTitle } from "../../components/pageTitle/pageTitle";
import { CustomDivider } from "../../components/customDivider";

import HeaderButton from "../../components/buttons/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HeaderAppBar from "../../components/appBar/AppBar";
import HeaderSearch from "../../components/textField/HeaderSearch";
import DebounceSelect from "../../components/select/DebounceSelect";

import { Wrapper } from "../../components/wrapper";
import { DocumentCard } from "./components/documentCard";
import GlobalModal from '../../components/modal/GlobalModal'
import { useOpenCloseDrawer } from "../../hooks/useOpenCloseDrawer";
import CloseIcon from '@mui/icons-material/Close';
import FieldLabel from "../../components/textField/LabelInput";

const DocumentsPage = () => {
    const { open, openSet, closeSet } = useOpenCloseDrawer();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const documents = [
        {
            id: 1,
            title: "Employee Handbook 2024",
            size: "2.4 MB",
            description: "Complete guide to company policies, procedures and employee benefits.",
            date: "2024-01-10",
            author: "Amanda White",
            type: "pdf",
        },
        {
            id: 2,
            title: "Code of Conduct",
            size: "1.8 MB",
            description: "Professional standards and ethical guidelines for all employees.",
            date: "2024-01-05",
            author: "Amanda White",
            type: "doc",
        },
        {
            id: 3,
            title: "IT Security Policy",
            size: "1.2 MB",
            description: "Guidelines for data protection, password management and cybersecurity.",
            date: "2024-01-15",
            author: "David Wilson",
            type: "pdf",
        },
    ];

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Lütfen bir dosya seçin");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);

        try {
            const res = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            alert("Dosya yüklendi: " + data.filename);

            // Modal’i kapat
            closeSet();

            // Formu temizle
            setFile(null);
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error(err);
            alert("Yükleme sırasında hata oluştu");
        }
    };

    return (
        <>
            <GlobalModal open={open} onClose={closeSet} maxWidth="sm" fullWidth>
                <Box sx={{ p: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="h5">Upload Document</Typography>
                        <IconButton onClick={closeSet}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <form onSubmit={handleUpload}>
                        <FieldLabel
                            label={'Document title'}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <FieldLabel
                            label={'Description'}
                            maxRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Box sx={{ mt: 2 }}>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            disabled={!file || !title}
                        >
                            Upload
                        </Button>
                    </form>
                </Box>
            </GlobalModal>

            <Box className="Documents">
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <PageTitle
                        title={"Company Documents"}
                        subTitle={"Manage and share company documents"}
                    />
                    <HeaderButton
                        icon={<FileUploadIcon />}
                        className="whitespace-nowrap h-10"
                        onClick={openSet}
                    >
                        Upload Document
                    </HeaderButton>
                </Box>

                <CustomDivider sx={{ mb: 5 }} />

                <HeaderAppBar>
                    <form className="flex gap-3 w-1/2">
                        <HeaderSearch />
                        <DebounceSelect />
                    </form>
                </HeaderAppBar>

                <Divider />

                <Wrapper sx={{
                    p: 3,
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                }}>
                    <Grid container spacing={3}>
                        {documents.map((doc) => (
                            <Grid item xs={12} sm={6} md={4} key={doc.id}>
                                <DocumentCard
                                    title={doc.title}
                                    size={doc.size}
                                    description={doc.description}
                                    date={doc.date}
                                    author={doc.author}
                                    type={doc.type}
                                    onDownload={() => console.log("Download", doc.id)}
                                    onEdit={() => console.log("Edit", doc.id)}
                                    onDelete={() => console.log("Delete", doc.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Wrapper>
            </Box>
        </>
    );
};

export default DocumentsPage;
