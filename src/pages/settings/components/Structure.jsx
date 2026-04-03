import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useColorScheme,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "../../../hooks/useLocale";
import AddDepartmentModal from "../modal/AddDepartment";
import EditDepartmentModal from "../modal/EditDepartment";
import AddPositionModal from "../modal/AddPosition";
import EditPositionModal from "../modal/EditPosition";
import { getAllDepartments, getAllJobs } from "../../../api/queries/getters";
import { deleteDepartment, deleteJobs } from "../../../api/queries/delete";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  isPending,
  title,
  itemName,
}) => {
  const { t } = useLocale();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success(t("settings.deleteSuccess"));
    } catch (e) {
      console.log(e);
      toast.error(t("settings.deleteFailed"));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 480,
          borderRadius: "12px",
          boxShadow: "0px 25px 50px -12px #00000040",
          p: 0,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2.5,
          pb: 2,
        }}
      >
        <Typography fontSize="16px" fontWeight={600}>
          {title || t("settings.deleteConfirmTitle")}
        </Typography>

        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      {/* Content */}
      <DialogContent sx={{ px: 3, py: 1, mt: 2 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "text.secondary",
            lineHeight: "20px",
          }}
        >
          {t("settings.deleteConfirmDescPrefix")}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {itemName}
          </Box>
          {t("settings.deleteConfirmDescSuffix")}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 2,
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isPending}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            height: "36px",
            color: "#111827",
            borderColor: "#D1D5DB",
          }}
        >
          {t("common.cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress size={14} color="inherit" /> : null
          }
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            height: "36px",
            bgcolor: "#DC2626", // 🔥 danger red
            "&:hover": { bgcolor: "#B91C1C" },
          }}
        >
          {isPending ? t("common.deleting") : t("common.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PositionCard = ({ position, onEdit, onDelete }) => {
  const { t } = useLocale();
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "342.66px",
        minHeight: "75px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left */}
      <Box>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20px",
            color: "text.primary",
          }}
        >
          {position.job_title ?? position.title}
        </Typography>

        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "16px",
            color: "text.secondary",
          }}
        >
          {position.employee_count ?? position.employeeCount ?? 0}{" "}
          {t("settings.structure.employees")}
        </Typography>
      </Box>

      {/* Right Icons */}
      <Box display="flex" alignItems="center" gap={0.5}>
        <IconButton
          size="small"
          onClick={() => onEdit(position)}
          sx={{ p: 0.5 }}
        >
          <AiOutlineEdit sx={{ fontSize: 16 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onDelete(position)}
          sx={{ p: 0.5 }}
        >
          <RiDeleteBinLine sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

const DepartmentCard = ({
  department,
  onEditDept,
  onDeleteDept,
  onAddPosition,
  onEditPosition,
  onDeletePosition,
  mode,
}) => {
  const { t } = useLocale();
  const { data: positions = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", department.id],
    queryFn: () => getAllJobs(department.id),
    select: (res) => {
      if (Array.isArray(res?.data?.data)) return res.data.data;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
  });

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: mode === "dark" ? "action.hover" : "#F4F4F4",
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {department?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("settings.structure.head")}: {department?.head_of_departments} •{" "}
            {department?.employee_count || 0}{" "}
            {t("settings.structure.employees")}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 14 }} />}
            onClick={() => onAddPosition(department.id)}
            sx={{
              fontSize: "0.75rem",
              borderRadius: 1.5,
              px: 1.5,
              color: mode === "dark" ? "#fff" : "#333333",
              borderColor: "transparent",
              background: "var(--text-220, #9F9F9F33)",
              py: 0.5,
            }}
          >
            {t("settings.structure.addPos")}
          </Button>
          <IconButton size="small" onClick={() => onEditDept(department)}>
            <AiOutlineEdit size={20} />
          </IconButton>
          <IconButton size="small" onClick={() => onDeleteDept(department)}>
            <RiDeleteBinLine />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {jobsLoading ? (
          <Grid container spacing={1.5}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={60} />
              </Grid>
            ))}
          </Grid>
        ) : positions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            {t("settings.structure.noPos")}
          </Typography>
        ) : (
          <Grid container spacing={1.5}>
            {positions.map((pos) => (
              <Grid item xs={12} sm={6} md={4} key={pos.id}>
                <PositionCard
                  position={pos}
                  onEdit={onEditPosition}
                  onDelete={(position) =>
                    onDeletePosition(department.id, position)
                  }
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

const DepartmentSkeleton = () => (
  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
    <Box
      sx={{
        px: 3,
        py: 2,
        bgcolor: "grey.50",
        borderBottom: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Skeleton variant="text" width={160} height={24} />
      <Skeleton variant="text" width={220} height={18} />
    </Box>
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1.5}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Paper>
);

const CompanyStructure = () => {
  const queryClient = useQueryClient();
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);
  const [addPosition, setAddPosition] = useState(null);
  const [editPosition, setEditPosition] = useState(null);
  const [deletePos, setDeletePos] = useState(null);
  const { mode } = useColorScheme();
  const { t } = useLocale();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    select: (res) => {
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    },
  });

  const { mutate: confirmDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteDepartment({ id: deleteDept?.id.toString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setDeleteDept(null);
    },
    onError: (err) => {
      console.error("Delete department error:", err);
    },
  });

  const { mutate: confirmDeletePos, isPending: isDeletingPos } = useMutation({
    mutationFn: () => deleteJobs(deletePos?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", deletePos?.deptId] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setDeletePos(null);
    },
    onError: (err) => {
      console.error("Delete position error:", err);
    },
  });

  const handleDeletePosition = (deptId, position) =>
    setDeletePos({
      id: position.id,
      name: position.job_title ?? position.title,
      deptId,
    });

  const handleAddPosition = (deptId) => {
    const dept = data?.find((d) => d.id === deptId);
    setAddPosition({ deptId, deptName: dept?.name ?? "" });
  };

  const handleEditPosition = (pos, deptId, deptName) => {
    setEditPosition({ position: pos, deptId, deptName });
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography fontSize={18} fontWeight={600}>
          {t("settings.structure.title")}
        </Typography>
        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setAddDeptOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            px: 2.5,
            fontWeight: 600,
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {t("settings.structure.addDept")}
        </Button>
      </Box>

      {isLoading && (
        <>
          {[1, 2, 3].map((i) => (
            <DepartmentSkeleton key={i} />
          ))}
        </>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("settings.structure.errorDepts")}:{" "}
          {error?.message ?? "Some problems"}
        </Alert>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <Typography color="text.secondary">
          {t("settings.structure.noDepts")}
        </Typography>
      )}

      {!isLoading &&
        !isError &&
        data?.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onEditDept={(d) => setEditDept(d)}
            onDeleteDept={(d) => setDeleteDept(d)}
            onAddPosition={handleAddPosition}
            onEditPosition={(pos) =>
              handleEditPosition(pos, dept.id, dept.name)
            }
            onDeletePosition={handleDeletePosition}
            mode={mode}
          />
        ))}

      <AddDepartmentModal
        open={addDeptOpen}
        onClose={() => setAddDeptOpen(false)}
      />
      <EditDepartmentModal
        open={!!editDept}
        department={editDept}
        onClose={() => setEditDept(null)}
      />
      <DeleteConfirmDialog
        open={!!deleteDept}
        onClose={() => setDeleteDept(null)}
        onConfirm={confirmDelete}
        isPending={isDeleting}
        title={t("settings.modal.deleteDeptTitle")}
        itemName={deleteDept?.name}
      />
      <DeleteConfirmDialog
        open={!!deletePos}
        onClose={() => setDeletePos(null)}
        onConfirm={confirmDeletePos}
        isPending={isDeletingPos}
        title={t("settings.modal.deletePosTitle")}
        itemName={deletePos?.name}
      />
      <AddPositionModal
        open={!!addPosition}
        onClose={() => setAddPosition(null)}
        departmentId={addPosition?.deptId}
        departmentName={addPosition?.deptName}
      />
      <EditPositionModal
        open={!!editPosition}
        onClose={() => setEditPosition(null)}
        position={editPosition?.position}
        departmentId={editPosition?.deptId}
        departmentName={editPosition?.deptName}
      />
    </Box>
  );
};

export default CompanyStructure;
