import { useState } from "react";
import { Box, MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";
import { useLocale } from "../../../hooks/useLocale";


const Header = () => {
  const { t } = useLocale();
  const [department, setDepartment] = useState("");

  const [employee, setEmployee] = useState("");

  return (
    <HeaderAppBar>
      <Box sx={{ width: "50%", display: "flex", gap: 3 }}>
        <DebounceSelect
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            {t('common.allDepartments')}
          </MenuItem>
          <MenuItem value={1}>IT</MenuItem>
          <MenuItem value={2}>HR</MenuItem>
        </DebounceSelect>

        <DebounceSelect
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            {t('common.allStatus')}
          </MenuItem>
          <MenuItem value={1}>John</MenuItem>
          <MenuItem value={2}>Jane</MenuItem>
        </DebounceSelect>
      </Box>
    </HeaderAppBar>
  );
};

export default Header;
