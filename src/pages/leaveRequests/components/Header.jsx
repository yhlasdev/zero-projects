import { useState } from "react";
import { Box, MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";


const Header = ({ onAddClick }) => {
  const [department, setDepartment] = useState("");
  const [employee, setEmployee] = useState("");
  const [search, setSearch] = useState("");

  return (
    <HeaderAppBar>
      <Box width={'50%'} display={'flex'} gap={4}>
        <DebounceSelect
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            All status
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
            All types
          </MenuItem>
          <MenuItem value={1}>John</MenuItem>
          <MenuItem value={2}>Jane</MenuItem>
        </DebounceSelect>
      </Box>  
    </HeaderAppBar>
  );
};

export default Header;
