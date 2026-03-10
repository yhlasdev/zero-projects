import { useState } from "react";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";

import { PageTitle } from "../../components/pageTitle/pageTitle";
import { CustomDivider } from "../../components/customDivider";

import HeaderButton from "../../components/buttons/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HeaderAppBar from "../../components/appBar/AppBar";
import HeaderSearch from "../../components/textField/HeaderSearch";
import DebounceSelect from "../../components/select/DebounceSelect";

import { Wrapper } from "../../components/wrapper";
import { DocumentCard } from "./components/documentCard";
import GlobalModal from "../../components/modal/GlobalModal";
import { useOpenCloseDrawer } from "../../hooks/useOpenCloseDrawer";
import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { getAllDocuments } from "../../api/queries/getters";
import UploadContent from "./components/UploadContent";

const DocumentsPage = () => {
  const { open, openSet, closeSet } = useOpenCloseDrawer();
  const [filters, setFilter] = useState({
    search: "",
  });

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
            <HeaderSearch onSearch={setFilter} />
            <DebounceSelect />
          </form>
        </HeaderAppBar>

        <Divider />

        <Wrapper
          sx={{
            p: 3,
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <Grid container spacing={3}>
            {data?.length > 0 ? data?.map((doc) => (
              <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <DocumentCard
                  title={doc.title}
                  description={doc.description}
                  file_type={doc.file_type}
                  updated_at={doc.updated_at}
                  manager_name={doc.manager_name}
                  onDownload={() => window.open(doc.file)}
                  onEdit={() => console.log("edit", doc.id)}
                  onDelete={() => console.log("delete", doc.id)}
                />
              </Grid>
            )): 
            <Typography
              sx={{
                p: 3,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 'calc(100vh - 370px)',
              }}
            >
              No documents found.
            </Typography>
            }
          </Grid>
        </Wrapper>
      </Box>
    </>
  );
};

export default DocumentsPage;
