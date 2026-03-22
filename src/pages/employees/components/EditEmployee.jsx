import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  MenuItem,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  getAllDepartment,
  getEmployeeById,
} from "../../../api/queries/getters";
import { updateEmployee } from "../../../api/queries/put";
import DebounceSelect from "../../../components/select/DebounceSelect";

const CustomFieldLabel = ({ label, ...props }) => (
  <Box sx={{ width: "100%" }}>
    <Typography
      sx={{
        fontSize: "13px",
        fontWeight: 500,
        mb: "6px",
        color: "#344054",
      }}
    >
      {label}
    </Typography>
    <TextField
      fullWidth
      size="small"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#fff",
          fontSize: "14px",
          "& fieldset": { borderColor: "#D0D5DD" },
        },
        ...props.sx,
      }}
    />
  </Box>
);

export default function EditEmployeeContent({ onClose, employeeId }) {
  const queryClient = useQueryClient();

  const MODAL_WIDTH = "896px";
  const MODAL_HEIGHT = "725px";
  const RADIUS_8 = "8px";
  const MODAL_RADIUS = "12px";

  const { data, isLoading } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployeeById(employeeId),
    enabled: !!employeeId,
    refetchOnMount: true,
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartment,
  });
  const departments = departmentsData?.data?.data || [];

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      department_id: 0,
      employee_id: 0,
      hiring_date: "",
      is_active: true,
      job_id: 0,
      probation_end_date: "",
      working_time: "",
    },
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  useEffect(() => {
    if (data?.data?.data) {
      const emp = data.data.data;
      reset({
        department_id: emp.department?.id || 0,
        employee_id: emp.employee_id || 0,
        hiring_date: formatDateForInput(emp.hiring_date),
        probation_end_date: formatDateForInput(emp.probation_end_date),
        is_active: emp.is_active ?? true,
        job_id: emp.job?.id || 0,
        working_time: emp.work_timing || "",
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      department_id: Number(formData.department_id),
      employee_id: Number(formData.employee_id),
      hiring_date: formData.hiring_date,
      is_active: formData.is_active,
      job_id: Number(formData.job_id),
      probation_end_date: formData.probation_end_date,
      working_time: formData.working_time,
    };
    mutation.mutate(payload);
  };

  if (isLoading)
    return (
      <Box
        sx={{
          width: MODAL_WIDTH,
          height: MODAL_HEIGHT,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Ýüklenýär...
      </Box>
    );

  return (
    <Box
      sx={{
        width: MODAL_WIDTH,
        height: MODAL_HEIGHT,
        bgcolor: "#fff",
        borderRadius: MODAL_RADIUS,
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
        boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: "20px", color: "#101828" }}
        >
          Update Employee
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ px: 4, py: 1.5, flex: 1, overflowY: "auto" }}>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  mb: "6px",
                  color: "#344054",
                }}
              >
                Upload photo
              </Typography>
              <Box
                sx={{
                  border: "1.5px dashed #EAECF0",
                  borderRadius: RADIUS_8,
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#F9FAFB",
                  cursor: "pointer",
                }}
              >
                <CloudUploadOutlinedIcon
                  sx={{ color: "#667085", fontSize: 28 }}
                />
                <Typography sx={{ fontSize: "12px", mt: 1, color: "#475467" }}>
                  Click to upload or drag and drop
                </Typography>
              </Box>
            </Grid>

            <Grid
              size={6}
              sx={{ display: "flex", alignItems: "center", mt: 4, pl: 2 }}
            >
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value ? "active" : "inactive"}
                    onChange={(e) =>
                      field.onChange(e.target.value === "active")
                    }
                    sx={{ gap: 4 }}
                  >
                    <FormControlLabel
                      value="active"
                      control={<Radio size="small" />}
                      label={
                        <Typography sx={{ fontSize: "14px" }}>
                          Active
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="inactive"
                      control={<Radio size="small" />}
                      label={
                        <Typography sx={{ fontSize: "14px" }}>
                          Inactive
                        </Typography>
                      }
                    />
                  </RadioGroup>
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="job_id"
                control={control}
                render={({ field }) => (
                  <CustomFieldLabel label="Job ID" {...field} />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        mb: "6px",
                        color: "#344054",
                      }}
                    >
                      Department
                    </Typography>
                    <DebounceSelect
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onClear={() => field.onChange('')}
                      width="100%"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </DebounceSelect>
                  </Box>
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="employee_id"
                control={control}
                render={({ field }) => (
                  <CustomFieldLabel label="Employee ID" {...field} disabled />
                )}
              />
            </Grid>
            <Grid size={6}>
              <CustomFieldLabel
                label="Nationality"
                placeholder="Enter nationality"
                defaultValue={data?.data?.data?.user?.nationality}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="hiring_date"
                control={control}
                render={({ field }) => (
                  <CustomFieldLabel
                    label="Hiring date"
                    type="date"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="probation_end_date"
                control={control}
                render={({ field }) => (
                  <CustomFieldLabel
                    label="Probation end date"
                    type="date"
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="working_time"
                control={control}
                render={({ field }) => (
                  <CustomFieldLabel label="Working timing" {...field} />
                )}
              />
            </Grid>
            <Grid size={6}>
              <CustomFieldLabel
                label="Office"
                placeholder="Enter office"
                defaultValue={data?.data?.data?.office?.company_name}
              />
            </Grid>

            <Grid size={6}>
              <CustomFieldLabel
                label="Report to"
                placeholder="Enter report to"
                defaultValue={data?.data?.data?.office?.report_to || ""}
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            px: 4,
            pb: 5,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              color: "#344054",
              borderColor: "#D0D5DD",
              borderRadius: RADIUS_8,
              px: 3,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={mutation.isPending}
            sx={{
              textTransform: "none",
              bgcolor: "#0d2b4b",
              borderRadius: RADIUS_8,
              px: 3,
              "&:hover": { bgcolor: "#0a1d37" },
            }}
          >
            {mutation.isPending ? "Updating..." : "Update Employee"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
