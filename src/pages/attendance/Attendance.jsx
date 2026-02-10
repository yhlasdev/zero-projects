import { Box } from "@mui/material";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import Header from "./components/Header";
import EmployeeCell from "../../components/table/EmployeeCell";
import TableActions from "../../components/table/TableActions";
import GlobalTable from "../../components/table/Table";
import TablePaginationInfo from "../../components/table/TablePagination";
import StatusChip from "../../components/table/StatusChip";
import { useState } from "react";
import GlobalModal from "../../components/modal/GlobalModal";
import EditAttendance from "./components/EditAttendanceContent";

const AttendancePage = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const rows = [
    {
      id: "EMP001",
      name: "Sarah Johnson",
      department: "FOH",
      position: "Senior Software Engineer",
      checkIn: "08:55",
      checkOut: "17:30",
      status: "Present",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  ];

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <EmployeeCell
          name={row.name}
          subTitle={row.position}
          avatar={row.avatar}
        />
      ),
    },
    { key: "department", label: "Department" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onEdit={() => {
            setSelectedRow(row);
            setOpenEditModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <Box className="attendance">
      <PageTitle
        title="Attendance Report"
        subTitle="Track and manage employee attendance records"
      />

      <Header />
      <GlobalTable columns={columns} rows={rows} />
      <TablePaginationInfo total={12} />

      <GlobalModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedRow && (
          <EditAttendance
            data={selectedRow}
            onClose={() => setOpenEditModal(false)}
          />
        )}
      </GlobalModal>
    </Box>
  );
};

export default AttendancePage;
