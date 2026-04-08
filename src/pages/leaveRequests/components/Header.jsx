import { Box, MenuItem } from "@mui/material";
import DebounceSelect from "../../../components/select/DebounceSelect";
import HeaderAppBar from "../../../components/appBar/AppBar";
import { useLocale } from "../../../hooks/useLocale";


const Header = ({ setFilter, filters }) => {
  const { t } = useLocale();
  const AllTypes = [
    { value: "annual", label: t('leaveRequests.types.annual') },
    { value: "sick", label: t('leaveRequests.types.sick') },
    { value: "unpaid", label: t('leaveRequests.types.unpaid') },
  ];

  const AllStatus = [
    { value: "pending", label: 'Pending' },
    { value: "approve", label: 'Approve' },
    { value: "rejected", label: 'Rejected' },
  ];


  return (
    <HeaderAppBar>
      <Box width={"100%"} display={"flex"} gap={3}>
        <DebounceSelect
          label={t('leaveRequests.leaveType')}
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
          label={t('common.status')}
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