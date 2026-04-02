import {
  Popover,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllEmployeeForTask } from "../../../api/queries/getters";
import { avatarColor, getInitials } from "./CreateTaskUtils";

export default function AssigneePopover({ anchorEl, onClose, assignees, setAssignees, t }) {
  const [empSearch, setEmpSearch] = useState("");

  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ["task-employees", empSearch],
    queryFn: () => getAllEmployeeForTask({ search: empSearch }),
    enabled: Boolean(anchorEl),
    staleTime: 30_000,
  });

  const employees = empData?.data?.data?.length ? empData?.data?.data : [];

  const toggleAssignee = (emp) => {
    setAssignees((prev) =>
      prev.find((a) => a.user_id === emp.user_id)
        ? prev.filter((a) => a.user_id !== emp.user_id)
        : [...prev, emp],
    );
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => {
        setEmpSearch("");
        onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          mt: 0.5,
          boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
          width: 280,
        },
      }}
    >
      <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t("common.searchPlaceholder", {
            defaultValue: "Search or enter email...",
          })}
          value={empSearch}
          onChange={(e) => setEmpSearch(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: 13,
              "& fieldset": { borderColor: "divider" },
            },
          }}
        />
      </Box>

      <Box sx={{ maxHeight: 260, overflowY: "auto", pb: 1 }}>
        {empLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={20} />
          </Box>
        ) : employees.length === 0 ? (
          <Typography
            sx={{
              fontSize: 13,
              color: "#94a3b8",
              textAlign: "center",
              py: 2,
            }}
          >
            {t("tasks.noEmployees", { defaultValue: "No employees found" })}
          </Typography>
        ) : (
          employees.map((emp) => {
            const isSelected = assignees.some(
              (a) => a.user_id === emp.user_id,
            );
            const name =
              `${emp?.first_name || ""} ${emp?.last_name || ""}`.trim();
            return (
              <Box
                key={emp.user_id}
                onClick={() => toggleAssignee(emp)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 0.9,
                  cursor: "pointer",
                  bgcolor: isSelected ? "action.selected" : "transparent",
                  "&:hover": { bgcolor: "action.hover" },
                  transition: "background 0.1s",
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: avatarColor(emp.user_id),
                    color: "#fff",
                  }}
                >
                  {getInitials(emp?.first_name, emp?.last_name)}
                </Avatar>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                    color: "text.primary",
                    flex: 1,
                  }}
                >
                  {name}
                </Typography>
                {isSelected && (
                  <CheckIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Popover>
  );
}
