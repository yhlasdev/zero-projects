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
import AttendanceDetailsContent from "./AttendanceDetail";
import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { getAllAttendance } from "../../api/queries/getters";
import dayjs from "dayjs";

const AttendancePage = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  const [filters, setFilters] = useState({
    date: dayjs(),
    search: "",
    department_ids: [],
    status: [],
  });

  const attendanceQuery = useInfiniteGet({
    key: ["attendances"],
    apiFn: ({ ...restFilters }) =>
      getAllAttendance({
        date: restFilters.date?.format("YYYY-MM-DD"),
        search: restFilters.search,
        department_ids: restFilters.department_ids,
        status: restFilters.status,
      }),
    dataKey: "attendances",
    countKey: "total",
    filters,
  });

  const rows = attendanceQuery.data.map((item) => ({
    attendance_id: item?.attendance_id,
    employee_id: item?.employee_id,
    name: `${item?.user?.first_name} ${item.user?.last_name}`,
    department: item?.department?.name || "-",
    position: item?.job?.title || "-",
    checkInRaw: item?.check_in,
    checkOutRaw: item?.check_out,
    checkIn: item?.check_in
      ? dayjs(item?.check_in).format("HH:mm")
      : "-",
    checkOut: item?.check_out
      ? dayjs(item?.check_out).format("HH:mm")
      : "-",
    status: item?.status,
    hours: item?.hours,
    reason: item?.reason || '',
    avatar: `https://i.pravatar.cc/150?u=${item?.user?.id}`,
  }));

  const columns = [
    { key: "employee_id", label: "ID" },
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
    { key: "position", label: "Position" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "hours", label: "Hours" },
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
          onView={() => {
            setSelectedRow(row);
            setOpenViewModal(true);
          }}
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
      {openViewModal ? (
        <AttendanceDetailsContent employee={selectedRow} onClose={setOpenViewModal} />
      ) : (
        <>
          <PageTitle
            title="Attendance Report"
            subTitle="Track and manage employee attendance records"
          />
          <Header filters={filters} setFilters={setFilters} />
          <GlobalTable
            columns={columns}
            rows={rows}
            onScroll={attendanceQuery.handleScroll}
            isLoading={attendanceQuery.isLoading}
            isFetchingNextPage={attendanceQuery.isFetchingNextPage}
            isError={attendanceQuery.isError}
            emptyMessage="No attendance records found"
          />
          {/* <TablePaginationInfo total={attendanceQuery.totalItems} /> */}
        </>
      )}

      <GlobalModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedRow && (
          <EditAttendance
            data={selectedRow}
            onClose={() => {
              setOpenEditModal(false);
              attendanceQuery.refetch();
            }} />
        )}
      </GlobalModal>
    </Box>
  );
};

export default AttendancePage;