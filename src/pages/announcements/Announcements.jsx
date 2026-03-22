import { useState } from "react";
import { Box, Tabs, Tab, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderButton from "../../components/buttons/Button";
import HeaderAppBar from "../../components/appBar/AppBar";
import AnnouncementContent from "./components/AnnouncementContent";
import GlobalModal from "../../components/modal/GlobalModal";
import StatusChip from "../../components/table/StatusChip";
import GlobalTable from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";

import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { useAppMutation } from "../../hooks/useMutation";
import { getAllAnnouncement } from "../../api/queries/getters";
import { deleteAnnouncement } from "../../api/queries/delete";
import { formatTimeYear } from "../../utils/formatTime";
import AnnouncementDetail from "./components/AnnouncementDetail";

const AnnouncementsPage = () => {
  const [filters, setFilters] = useState({
    status: "",
  });
  const [tab, setTab] = useState(0);
  const [isModal, setModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedId, setSelectedDetail] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const announcementsQuery = useInfiniteGet({
    key: ["announcements"],
    apiFn: getAllAnnouncement,
    filters,
  });

  const deleteMutation = useAppMutation({
    mutationFn: deleteAnnouncement,
    queryKey: ["announcements"],
    onSuccess: () => {
      setDeleteModal(false);
      setDeleteId(null);
      announcementsQuery.refetch();
    },
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);

    let newStatus = "";
    if (newValue === 1) newStatus = "publish";
    if (newValue === 2) newStatus = "draft";
    setFilters((prev) => ({ ...prev, status: newStatus }));
  };

  const handleOpenModal = (data = null) => {
    setSelectedAnnouncement(data);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setSelectedAnnouncement(null);
    announcementsQuery.refetch();
  };

  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
    }
  };

  const columns = [
    {
      key: "Text",
      label: "Title",
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.Text || "No Title"}
        </Typography>
      ),
    },
    {
      key: "CreatedAt",
      label: "Date",
      render: (row) => <Box>{formatTimeYear(row.CreatedAt)}</Box>,
    },
    {
      key: "TargetAudience",
      label: "Target Audience",
      render: (row) => row.TargetAudience || "General",
    },
    {
      key: "Status",
      label: "Status",
      render: (row) => <StatusChip status={row.Status} />,
    },
    {
      key: "ReadCount",
      label: "Read stats",
      render: (row) => (
        <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
          {row?.ReadCount || 0} / {row?.SendCount || 0}
        </Box>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onEdit={() => handleOpenModal(row)}
          onView={() => {
            setSelectedDetail(row);
            setIsDetailModal(true);
          }}
          onDelete={() => handleDeleteOpen(row.ID)}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <PageTitle
          title="Announcements"
          subTitle="Manage and track company-wide announcements"
        />
        <HeaderButton
          onClick={() => handleOpenModal(null)}
          width={'200px'}
          icon={<AddIcon sx={{ width: "14px", height: "14px" }} />}
        >
          New Announcement
        </HeaderButton>
      </Box>

      <HeaderAppBar>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            px: 2,
            minHeight: "48px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            label="All"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              minWidth: "auto",
              px: 1.5,
              mx: 0.5,
              borderRadius: "12px",
              color: "#475467",
              "&.Mui-selected": {
                backgroundColor: "#0F3254",
                color: "#fff",
              },
            }}
          />
          <Tab
            label="Published"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              minWidth: "auto",
              px: 1.5,
              mx: 0.5,
              borderRadius: "12px",
              color: "#475467",
              "&.Mui-selected": {
                backgroundColor: "#102A43",
                color: "#fff",
              },
            }}
          />
          <Tab
            label="Draft"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              minWidth: "auto",
              px: 1.5,
              mx: 0.5,
              borderRadius: "12px",
              color: "#475467",
              "&.Mui-selected": {
                backgroundColor: "#102A43",
                color: "#fff",
              },
            }}
          />
        </Tabs>
      </HeaderAppBar>

      <GlobalTable
        columns={columns}
        rows={announcementsQuery.data}
        onScroll={announcementsQuery.handleScroll}
        isLoading={announcementsQuery.isLoading}
        isFetchingNextPage={announcementsQuery.isFetchingNextPage}
        isError={announcementsQuery.isError}
        emptyMessage="No announcements found for this category."
      />

      <GlobalModal open={isModal} onClose={handleCloseModal} width={896}>
        <AnnouncementContent
          data={selectedAnnouncement}
          onClose={handleCloseModal}
        />
      </GlobalModal>

      <GlobalModal
        open={isDetailModal}
        onClose={() => setIsDetailModal(false)}
        width={896}
      >
        <AnnouncementDetail
          id={selectedId?.ID}
          onClose={() => setIsDetailModal(false)}
        />
      </GlobalModal>

      <GlobalModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        width={400}
      >
        <Box p={3}>
          <Typography variant="h6" mb={2}>
            Delete Announcement
          </Typography>
          <Typography mb={3} color="text.secondary">
            Are you sure you want to delete this announcement? This action cannot be undone.
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setDeleteModal(false)}
              sx={{ borderRadius: "8px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              sx={{ borderRadius: "8px" }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        </Box>
      </GlobalModal>
    </Box>
  );
};

export default AnnouncementsPage;
