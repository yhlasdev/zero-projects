import { Box, MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";

const Header = ({ setFilter, filters }) => {
  const AllTypes = [
    { value: "annual", label: "Annual" },
    { value: "slick", label: "Slick" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const AllStatus = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
  ];

  return (
    <HeaderAppBar>
      <Box width={"100%"} display={"flex"} gap={3}>
        <DebounceSelect
          label="All types"
          width="297px"
          value={filters.type || ""}
          onChange={(e) => setFilter({ ...filters, type: e.target.value })}
          onClear={() => setFilter({ ...filters, type: "" })}
        >
          {AllTypes?.map((e) => (
            <MenuItem key={e.value} value={e.value}>
              {e.label}
            </MenuItem>
          ))}
        </DebounceSelect>

        <DebounceSelect
          label="All status"
          width="297px"
          value={filters.status || ""}
          onChange={(e) => setFilter({ ...filters, status: e.target.value })}
          onClear={() => setFilter({ ...filters, status: "" })}
        >
          {AllStatus?.map((e) => (
            <MenuItem key={e.value} value={e.value}>
              {e.label}
            </MenuItem>
          ))}
        </DebounceSelect>
      </Box>
    </HeaderAppBar>
  );
};

export default Header;