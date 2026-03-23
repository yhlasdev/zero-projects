import { useState } from "react";
import { Box, Divider, Paper, Typography, MenuItem } from "@mui/material";

import { PageTitle } from "../../components/pageTitle/pageTitle";
import { CustomDivider } from "../../components/customDivider";

import HeaderButton from "../../components/buttons/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HeaderAppBar from "../../components/appBar/AppBar";
import HeaderSearch from "../../components/textField/HeaderSearch";
import DebounceSelect from "../../components/select/DebounceSelect";

import { DocumentCard } from "./components/documentCard";
import GlobalModal from "../../components/modal/GlobalModal";
import { useOpenCloseDrawer } from "../../hooks/useOpenCloseDrawer";
import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { getAllDocuments } from "../../api/queries/getters";
import { useQueryClient } from "@tanstack/react-query";
import UploadContent from "./components/UploadContent";

const allowedExtensions = [
  "jpg",
  "jpeg",
  "png",
  "txt",
  "pdf",
  "xls",
  "xlsx",
  "doc",
  "docx",
];

const DocumentsPage = () => {
  const { open, openSet, closeSet } = useOpenCloseDrawer();
  const queryClient = useQueryClient();
  const [filters, setFilter] = useState({
    search: "",
    fileTypes: [],
  });

  const handleSearch = (val) => setFilter((prev) => ({ ...prev, search: val }));
  const handleTypeSelect = (e) => setFilter((prev) => ({
    ...prev,
    fileTypes: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
  }));
  const handleClearType = () => setFilter((prev) => ({ ...prev, fileTypes: [] }));

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://194.156.117.223:8007/yerinde/company-service/documents/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete document");
      }
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error) {
    }
  };

  const { data } = useInfiniteGet({
    key: "documents",
    apiFn: getAllDocuments,
    limit: 30,
    filters,
    dataKey: "documents",
  });

  return (
    <>
      <GlobalModal open={open} onClose={closeSet} maxWidth="sm" fullWidth>
        <UploadContent closeSet={closeSet} />
      </GlobalModal>

      <Box className="Documents">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            <HeaderSearch value={filters.search} onSearch={handleSearch} />
            <DebounceSelect
              multiple
              width="297px"
              value={filters.fileTypes || []}
              onChange={handleTypeSelect}
              onClear={handleClearType}
              label="File Types"
              displayEmpty
            >
              <MenuItem value="" disabled sx={{ display: 'none' }}>
                <em>All Types</em>
              </MenuItem>
              {allowedExtensions.map((ext) => (
                <MenuItem key={ext} value={ext.toUpperCase()}>
                  {ext.toUpperCase()}
                </MenuItem>
              ))}
            </DebounceSelect>
          </form>
        </HeaderAppBar>

        <Divider />
        <Paper sx={{ height: "calc(100vh - 320px)", overflowY: "auto", p: 3 }}>
          {data?.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 3,
              }}
            >
              {data?.map((doc) => {
                const isImage = ["JPG", "JPEG", "PNG", "WEBP"].includes(doc.file_type?.toUpperCase());
                const downloadUrl = isImage
                  ? `http://194.156.117.223:8004/yerinde/storage-service/documents/${doc.file}/150x150.webp`
                  : doc.file;

                return (
                  <DocumentCard
                    key={doc.id}
                    title={doc.title}
                    description={doc.description}
                    file_type={doc.file_type}
                    updated_at={doc.updated_at}
                    manager_name={doc.manager_name}
                    onDownload={() => window.open(downloadUrl, "_blank")}
                    onEdit={() => console.log("edit", doc.id)}
                    onDelete={() => handleDelete(doc.id)}
                  />
                );
              })}
            </Box>
          ) : (
            <Typography
              sx={{
                p: 3,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 370px)",
              }}
            >
              No documents found.
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default DocumentsPage;
