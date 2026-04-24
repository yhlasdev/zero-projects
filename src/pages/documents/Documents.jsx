import { useState } from "react";
import { Box, Divider, Paper, Typography, MenuItem, CircularProgress } from "@mui/material";

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
import { deleteDocument } from "../../api/queries/delete";
import UploadContent from "./components/UploadContent";
import { useLocale } from "../../hooks/useLocale";
import { useAppMutation } from "../../hooks/useMutation";
import { toast } from "react-toastify";
import Seo from "../../components/seo/seo";

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
  const { t } = useLocale();
  const { open, openSet, closeSet } = useOpenCloseDrawer();
  const [filters, setFilter] = useState({
    search: "",
    file_types: [],
  });
  const [editingDoc, setEditingDoc] = useState(null);

  const handleSearch = (val) => setFilter((prev) => ({ ...prev, search: val }));
  const handleTypeSelect = (e) =>
    setFilter((prev) => ({
      ...prev,
      file_types:
        typeof e.target.value === "string"
          ? e.target.value.split(",")
          : e.target.value,
    }));
  const handleClearType = () =>
    setFilter((prev) => ({ ...prev, file_types: [] }));
  const handleEdit = (doc) => {
    setEditingDoc(doc);
    openSet();
  };
  const handleCloseModal = () => {
    closeSet();
    setEditingDoc(null);
  };

  const handleDownload = async (docId, fileObj, title) => {
    try {
      const fileData = fileObj?.content?.[0];
      if (!fileData) throw new Error("File data not found");

      const isImage = fileData?.type === "image";

      const url = isImage
        ? `http://194.156.117.223:8004/yerinde/storage-service/documents/${fileData.path}/150x150${fileData.mime}`
        : `http://194.156.117.223:8004/yerinde/storage-service/documents/${fileData.path}/original${fileData.mime}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${title}${fileData.mime}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log("Download error:", error);
      toast.error(t("documents.downloadErr") || "Download failed");
    }
  };

  const { mutate: deleteMutate } = useAppMutation({
    mutationFn: deleteDocument,
    queryKey: ["documents"],
  });

  const { isLoading, isError, data } = useInfiniteGet({
    key: "documents",
    apiFn: getAllDocuments,
    limit: 30,
    filters,
    dataKey: "documents",
  });

  return (
    <>
      <GlobalModal
        open={open}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <UploadContent closeSet={handleCloseModal} editingDoc={editingDoc} />
      </GlobalModal>

      <Box className="Documents">
        <Seo
          title={t("documents.title")}
          description={t("documents.subTitle")}
          name="Yerinde"
          type="website"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageTitle
            title={t("documents.title")}
            subTitle={t("documents.subTitle")}
          />
          <HeaderButton
            icon={<FileUploadIcon />}
            className="whitespace-nowrap h-10"
            onClick={openSet}
          >
            {t("documents.uploadDoc")}
          </HeaderButton>
        </Box>

        <CustomDivider sx={{ mb: 5 }} />

        <HeaderAppBar>
          <form className="flex gap-3 w-1/2">
            <HeaderSearch value={filters.search} onSearch={handleSearch} />
            <DebounceSelect
              multiple
              width="297px"
              value={filters.file_types || []}
              onChange={handleTypeSelect}
              onClear={handleClearType}
              label={t("documents.fileTypes")}
              displayEmpty
            >
              <MenuItem value="" disabled sx={{ display: "none" }}>
                <em>{t("documents.allTypes")}</em>
              </MenuItem>
              {allowedExtensions.map((ext) => (
                <MenuItem key={ext} value={ext.toUpperCase()}>
                  {t(`documents.types.${ext}`)}
                </MenuItem>
              ))}
            </DebounceSelect>
          </form>
        </HeaderAppBar>

        <Divider />
        <Paper sx={{ height: "calc(100vh - 320px)", overflowY: "auto", p: 3 }}>
          {isLoading ? (
            <Box
              display={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90%",
              }}
            >
              <CircularProgress aria-label={t("common.loading")} />
            </Box>
          ) : isError ? (
            <Box>{t("common.error")}</Box>
          ) : null}
          {data?.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 1,
              }}
            >
              {data?.map((doc) => {
                const fileData = doc.file?.content?.[0];
                const isImage = fileData?.type === "image";
                const previewUrl = isImage
                  ? `http://194.156.117.223:8004/yerinde/storage-service/documents/${fileData.path}/150x150.webp`
                  : null;

                return (
                  <DocumentCard
                    key={doc.id}
                    title={doc.title}
                    description={doc.description}
                    file_type={doc.file_type}
                    updated_at={doc.updated_at}
                    manager_name={doc.manager_name}
                    previewUrl={previewUrl}
                    onDownload={() =>
                      handleDownload(doc.id, doc.file, doc.title)
                    }
                    onEdit={() => handleEdit(doc)}
                    onDelete={() => deleteMutate(doc.id)}
                  />
                );
              })}
            </Box>
          ) : !isLoading && !isError ? (
            <Typography align="center" sx={{ mt: 5 }}>
              {t("documents.noDocs")}
            </Typography>
          ) : null}
        </Paper>
      </Box>
    </>
  );
};

export default DocumentsPage;
