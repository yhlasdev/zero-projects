import { MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";
import HeaderSearch from "../../../components/textField/HeaderSearch";
import { useQuery } from "@tanstack/react-query";
import { getAllDepartment, getAllJobs } from "../../../api/queries/getters";
import JobSelect from "./JobSelect";
import { useLocale } from "../../../hooks/useLocale";

const Header = ({ setFilter, filters }) => {
  const { t } = useLocale();

  const { data, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartment,
  });
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", filters.department_id],
    queryFn: () => getAllJobs(filters.department_id),
    enabled: !!filters.department_id,
  });
  const departments = data?.data?.data || [];
  const allJobs = jobsData?.data?.data || [];

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setFilter((prev) => ({
      ...prev,
      department_id: value,
      job_id: "",
    }));
  };

  return (
    <HeaderAppBar>
      <HeaderSearch
        value={filters.search}
        onSearch={(val) => setFilter((prev) => ({ ...prev, search: val }))}
      />

      <DebounceSelect
        value={filters.department_id || ""}
        onChange={handleDepartmentChange}
        placeholder={t('common.department')}
        width="297px"
        onClear={() => setFilter((prev) => ({ ...prev, department_id: "" }))}
      >
        {isLoading ? (
          <MenuItem disabled>{t('common.loading')}</MenuItem>
        ) : (
          departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))
        )}
      </DebounceSelect>
      <JobSelect
        value={filters.job_id || ""}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, job_id: e.target.value }))
        }
        onClear={() => setFilter((prev) => ({ ...prev, job_id: "" }))}
        placeholder={t('common.title')}
        options={allJobs}
        loading={jobsLoading}
        disabled={!filters.department_id}
      />
      {/* <HeaderButton icon={<AddIcon />} onClick={onAddClick}>
        Add Employee
      </HeaderButton> */}
    </HeaderAppBar>
  );
};

export default Header;
