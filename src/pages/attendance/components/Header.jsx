import { Button, MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";
import HeaderSearch from "../../../components/textField/HeaderSearch";
import GlobalDateSelect from "../../../components/dateSelect/DateSelect";
import { getAllDepartment } from "../../../api/queries/getters";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";

const Header = ({ filters, setFilters, setOpenExportModal }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartment,
  });
  const departments = data?.data?.data || [];

  return (
    <HeaderAppBar>
      <HeaderSearch
        value={filters.search}
        onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
      />

      <GlobalDateSelect
        label=""
        value={filters.date}
        onChange={(val) =>
          setFilters((prev) => ({
            ...prev,
            date: val ? dayjs(val).format("YYYY-MM-DD") : null,
          }))
        }
      />
      <DebounceSelect
        value={filters.department_ids[0] || ""}
        label={"All departments"}
        width={'205px'}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            department_ids: e.target.value ? [e.target.value] : [],
          }))
        }
      >
        {isLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))
        )}
      </DebounceSelect>

      <DebounceSelect
        value={filters.status[0] || ""}
        width={'205px'}
        label={"All status"}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            status: e.target.value ? [e.target.value] : [],
          }))
        }
      >
        <MenuItem value="present">Present</MenuItem>
        <MenuItem value="absent">Absent</MenuItem>
        <MenuItem value="on_leave">On leave</MenuItem>
        <MenuItem value="day_off">Day off</MenuItem>
      </DebounceSelect>

      <Button
        onClick={() => setOpenExportModal(true)}
        variant="outlined"
        startIcon={<DownloadIcon sx={{width: '14px', height: '14px'}}/>}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: '14px',
          px: 2.5,
          py: 1,
          width: '100px',
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: "#1e3a5f" },
        }}
      >
        Export
      </Button>
    </HeaderAppBar>
  );
};

export default Header;
