import { MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";
import HeaderButton from "../../../components/buttons/Button";
import HeaderSearch from "../../../components/textField/HeaderSearch";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { getAllDepartment } from "../../../api/queries/getters";

const Header = ({ onAddClick, setFilter, filters }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartment
  });

  const departments = data?.data?.data || [];

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setFilter(prev => ({ ...prev, department_id: value }));
  };

  return (
    <HeaderAppBar>
      <HeaderSearch
        value={filters.search || ""}
        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
        placeholder="Search employee"
      />

      <DebounceSelect
        value={filters.department || ""}
        onChange={handleDepartmentChange}
        displayEmpty
      >
        <MenuItem value="">All department</MenuItem>
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

      <HeaderButton icon={<AddIcon />} onClick={onAddClick}>
        Add Employee
      </HeaderButton>
    </HeaderAppBar>
  );
};

export default Header;
