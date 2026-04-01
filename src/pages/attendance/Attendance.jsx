import { Box } from "@mui/material";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import Header from "./components/Header";
import EmployeeCell from "../../components/table/EmployeeCell";
import TableActions from "../../components/table/TableActions";
import GlobalTable from "../../components/table/Table";
import StatusChip from "../../components/table/StatusChip";
import { useState } from "react";
import GlobalModal from "../../components/modal/GlobalModal";
import EditAttendance from "./components/EditAttendanceContent";
import AttendanceDetailsContent from "./AttendanceDetail";
import BulkExportModal from "./components/BulkeExport";
import { usePaginationGet } from "../../hooks/usePaginationGet";
import TablePaginationInfo from "../../components/table/TablePagination";
import { getAllAttendance } from "../../api/queries/getters";
import dayjs from "dayjs";
import { useLocale } from "../../hooks/useLocale";
import { useCallback } from "react";
import Seo from "../../components/seo/seo";

const AttendancePage = () => {
  const { t } = useLocale();
  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);

  const [filters, setFilters] = useState({
    date: dayjs(),
    search: "",
    department_ids: [],
    status: [],
  });

  const [page, setPage] = useState(1);

  const attendanceQuery = usePaginationGet({
    key: "attendances",
    apiFn: ({ page: apiPage, limit: apiLimit, ...restFilters }) =>
      getAllAttendance({
        page: apiPage,
        limit: apiLimit,
        date: restFilters.date?.format("YYYY-MM-DD"),
        search: restFilters.search,
        department_ids: restFilters.department_ids,
        status: restFilters.status,
      }),
    page,
    limit: 10,
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
    checkIn: item?.check_in ? dayjs(item?.check_in).format("HH:mm") : "-",
    checkOut: item?.check_out ? dayjs(item?.check_out).format("HH:mm") : "-",
    status: item?.status,
    hours: item?.hours?.toFixed(1),
    reason: item?.reason || "",
    avatar: `https://i.pravatar.cc/150?u=${item?.user?.id}`,
  }));

  const columns = [
    { key: "employee_id", label: t("common.id") },
    {
      key: "employee",
      label: t("common.employee"),
      render: (row) => (
        <EmployeeCell
          name={row.name}
          subTitle={row.position}
          avatar={`http://194.156.117.223:8004/yerinde/storage-service/attendances/${row?.employee_id}`}
        />
      ),
    },
    { key: "department", label: t("common.department") },
    { key: "position", label: t("common.position") },
    { key: "checkIn", label: t("common.checkIn") },
    { key: "checkOut", label: t("common.checkOut") },
    { key: "hours", label: t("dashboard.hours") },
    {
      key: "status",
      label: t("common.status"),
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "actions",
      label: t("common.actions"),
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

  const handleSearch = useCallback((val) => {
    setFilters((prev) => ({ ...prev, search: val }));
  }, []);

  return (
    <Box className="attendance">
      <Seo
        title={t("sidebar.attendance")}
        description={t("dashboard.reportSubtitle")}
        name="Yerinde"
        type="website"
      />
      <GlobalModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        width={820}
      >
        <AttendanceDetailsContent
          employee={selectedRow}
          onClose={setOpenViewModal}
        />
      </GlobalModal>

      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <PageTitle
            title={t("dashboard.reportTitle")}
            subTitle={t("dashboard.reportSubtitle")}
          />
        </Box>

        <Header
          filters={filters}
          setFilters={setFilters}
          setOpenExportModal={setOpenExportModal}
          handleSearch={handleSearch}
        />
        <GlobalTable
          columns={columns}
          rows={rows}
          isLoading={attendanceQuery.isLoading}
          isError={attendanceQuery.isError}
          emptyMessage={t("employees.noRecords")}
        />
        <TablePaginationInfo
          total={attendanceQuery.totalItems}
          page={page}
          limit={10}
          onChange={(val) => setPage(val)}
        />
      </>

      {/* Edit modal */}
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
            }}
          />
        )}
      </GlobalModal>

      <BulkExportModal
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        rows={rows}
        date={filters.date}
      />
    </Box>
  );
};

export default AttendancePage;
