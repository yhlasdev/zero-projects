import { Button, MenuItem, useColorScheme } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";
import HeaderSearch from "../../../components/textField/HeaderSearch";
import GlobalDateSelect from "../../../components/dateSelect/DateSelect";
import { getAllDepartment } from "../../../api/queries/getters";
import { useQuery } from "@tanstack/react-query";
import DownloadIcon from "@mui/icons-material/Download";
import { useLocale } from "../../../hooks/useLocale";

const Header = ({ filters, setFilters, setOpenExportModal, handleSearch }) => {
  const { t } = useLocale();
  const { mode } = useColorScheme();
  const { data, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartment,
  });
  const departments = data?.data?.data || [];

  return (
    <HeaderAppBar>
      <HeaderSearch value={filters.search} onSearch={handleSearch} />

      <GlobalDateSelect
        label=""
        value={filters.date}
        onChange={(val) =>
          setFilters((prev) => ({
            ...prev,
            date: val,
          }))
        }
      />
      <DebounceSelect
        value={filters.department_ids[0] || ""}
        label={t("common.allDepartments")}
        width={"205px"}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            department_ids: e.target.value ? [e.target.value] : [],
          }))
        }
        onClear={() =>
          setFilters((prev) => ({
            ...prev,
            department_ids: [],
          }))
        }
      >
        {isLoading ? (
          <MenuItem disabled>{t("common.loading")}</MenuItem>
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
        width={"205px"}
        label={t("common.allStatus")}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            status: e.target.value ? [e.target.value] : [],
          }))
        }
        onClear={() =>
          setFilters((prev) => ({
            ...prev,
            status: [],
          }))
        }
      >
        <MenuItem value="present">{t("attendance.present")}</MenuItem>
        <MenuItem value="absent">{t("attendance.absent")}</MenuItem>
        <MenuItem value="on_leave">{t("attendance.onLeave")}</MenuItem>
        <MenuItem value="day_off">{t("attendance.dayOff")}</MenuItem>
      </DebounceSelect>

      <Button
        onClick={() => setOpenExportModal(true)}
        variant="outlined"
        startIcon={<DownloadIcon sx={{ width: "14px", height: "14px" }} />}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          px: 2.5,
          border: "none",
          py: 1,
          width: "100px",
          whiteSpace: "nowrap",
          background: "var(--text-220, #9F9F9F33)",
          color:
            mode === "dark"
              ? "var(--text-100, #FFFFFF)"
              : "var(--text-100, #333333)",
        }}
      >
        {t("common.export", { defaultValue: "Export" })}
      </Button>
    </HeaderAppBar>
  );
};

export default Header;
