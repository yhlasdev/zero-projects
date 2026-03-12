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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AddDepartmentModal from "../modal/AddDepartment";
import EditDepartmentModal from "../modal/EditDepartment";
import { getAllDepartments } from "../../../api/queries/getters";
import { deleteDepartment } from "../../../api/queries/delete";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  isPending,
  departmentName,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { width: 500, borderRadius: "12px", p: 0 } }}
  >
    <DialogTitle sx={{ px: 3, pt: 2, pb: 2 }}>
      <Typography variant="h6" textAlign={"center"} fontWeight={700}>
        Delete Department
      </Typography>
    </DialogTitle>

    <DialogContent sx={{ px: 3, py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete
        <Typography
          component="span"
          variant="body2"
          mx={1}
          fontWeight={600}
          color="text.primary"
        >
          {departmentName}
        </Typography>
        ? This action cannot be undone.
      </Typography>
    </DialogContent>

    <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
      <Button
        variant="outlined"
        onClick={onClose}
        disabled={isPending}
        sx={{
          textTransform: "none",
          borderRadius: 1.5,
          px: 2.5,
          fontWeight: 500,
          color: "text.primary",
          borderColor: "grey.300",
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        disabled={isPending}
        startIcon={
          isPending ? <CircularProgress size={14} color="inherit" /> : null
        }
        sx={{
          textTransform: "none",
          borderRadius: 1.5,
          px: 2.5,
          fontWeight: 600,
          "&:hover": { bgcolor: "error.dark" },
        }}
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </DialogActions>
  </Dialog>
);

const PositionCard = ({ position, onEdit, onDelete }) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: "grey.200",
      borderRadius: 1.5,
      px: 2,
      py: 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      bgcolor: "background.paper",
    }}
  >
    <Box>
      <Typography variant="body2" fontWeight={500} color="text.primary">
        {position.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {position.employeeCount ?? position.employees ?? 0} employees
      </Typography>
    </Box>
    <Box display="flex" gap={0.5}>
      <IconButton size="small" onClick={() => onEdit(position)}>
        <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(position.id)}>
        <DeleteOutlineIcon sx={{ fontSize: 17 }} />
      </IconButton>
    </Box>
  </Box>
);

const DepartmentCard = ({
  department,
  onEditDept,
  onDeleteDept,
  onAddPosition,
  onEditPosition,
  onDeletePosition,
}) => {
  const positions = department.positions ?? department.jobPositions ?? [];

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
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {department?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Head: {department?.head_of_departments} •{" "}
            {department?.employee_count || 0} employees
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 14 }} />}
            onClick={() => onAddPosition(department.id)}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              borderRadius: 1.5,
              px: 1.5,
              py: 0.5,
            }}
          >
            Add Position
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
        {positions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No positions yet.
          </Typography>
        ) : (
          <Grid container spacing={1.5}>
            {positions.map((pos) => (
              <Grid item xs={12} sm={6} md={4} key={pos.id}>
                <PositionCard
                  position={pos}
                  onEdit={onEditPosition}
                  onDelete={(posId) => onDeletePosition(department.id, posId)}
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

  const handleDeletePosition = (deptId, posId) =>
    console.log("Delete pos:", posId, "dept:", deptId);
  const handleAddPosition = (deptId) =>
    console.log("Add position for dept:", deptId);
  const handleEditPosition = (pos) => console.log("Edit pos:", pos);

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography fontSize={18} fontWeight={600}>
          Departments & Positions
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
            bgcolor: "#1a2e44",
            "&:hover": { bgcolor: "#243d58" },
          }}
        >
          Add Department
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
          Getting the department: {error?.message ?? "Some problems"}
        </Alert>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <Typography color="text.secondary">Not added the Department</Typography>
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
            onEditPosition={handleEditPosition}
            onDeletePosition={handleDeletePosition}
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
        departmentName={deleteDept?.name}
      />
    </Box>
  );
};

export default CompanyStructure;
