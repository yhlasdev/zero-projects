import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import GlobalTable from "../../components/table/Table";
import EmployeeCell from "../../components/table/EmployeeCell";
import StatusChip from "../../components/table/StatusChip";
import TableActions from "../../components/table/TableActions";
import GlobalModal from "../../components/modal/GlobalModal";
import AddEmployeeContent from "./components/AddEmployeeContent";
import ViewEmployeeWeek from "./components/EmployeeDetailWeek";
import Header from "./components/Header";
import { usePaginationGet } from "../../hooks/usePaginationGet";
import TablePaginationInfo from "../../components/table/TablePagination";
import { getAllEmployee } from "../../api/queries/getters";
import EditEmployeeContent from "./components/EditEmployee";
import { useLocale } from "../../hooks/useLocale";
import Seo from "../../components/seo/seo";

const EmployeesPage = () => {
  const { t } = useLocale();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilter] = useState({
    department_id: "",
    job_id: "",
    search: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [filters.department_id, filters.job_id, filters.search]);

  const employeeQuery = usePaginationGet({
    key: "employees",
    apiFn: getAllEmployee,
    page,
    limit: 10,
    filters,
    dataKey: "employees",
  });


  const columns = [
    {
      key: "employee_id",
      label: t("common.id"),
      render: (row) => row.employee_id,
    },
    {
      key: "employee",
      label: t("common.employee"),
      render: (row) => (
        <EmployeeCell
          name={`${row.user?.first_name} ${row.user?.last_name}`}
          avatar={`http://194.156.117.223:8004/yerinde/storage-service/attendances/${row?.employee_id}`}
        />
      ),
    },
    {
      key: "title",
      label: t("common.title"),
      render: (row) => row.job?.title,
    },
    {
      key: "department",
      label: t("common.department"),
      render: (row) => row.department?.name,
    },
    {
      key: "nationality",
      label: t("common.nationality"),
      render: (row) => row.user?.nationality,
    },
    {
      key: "status",
      label: t("common.status"),
      render: (row) => (
        <StatusChip status={row.is_active ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      render: (row) => (
        <TableActions
          onCalendar={() => {
            setSelectedEmployee(row);
            setOpenViewModal(true);
          }}
          onDelete={() => console.log("del")}
          onEdit={() => {
            setSelectedEmployee(row);
            setOpenEditModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <Box className="employees">
      <Seo
        title={t("employees.title")}
        description={t("employees.subtitle")}
        name="Yerinde"
        type="website"
      />
      {openViewModal ? (
        <ViewEmployeeWeek
          employee={selectedEmployee}
          onClose={() => setOpenViewModal(false)}
        />
      ) : (
        <>
          <PageTitle
            title={t("employees.title")}
            subTitle={t("employees.subtitle")}
          />
          <Header
            // onAddClick={() => setOpenAddModal(true)}
            setFilter={setFilter}
            filters={filters}
          />
          <GlobalTable
            columns={columns}
            rows={employeeQuery?.data}
            isLoading={employeeQuery.isLoading}
            isError={employeeQuery.isError}
            emptyMessage={t("employees.noRecords")}
          />

          <TablePaginationInfo
            total={employeeQuery.totalItems}
            page={page}
            limit={10}
            onChange={(val) => setPage(val)}
          />
        </>
      )}

      <GlobalModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <AddEmployeeContent onClose={() => setOpenAddModal(false)} />
      </GlobalModal>

      <GlobalModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <EditEmployeeContent
          employeeId={selectedEmployee?.employee_id}
          onClose={() => setOpenEditModal(false)}
        />
      </GlobalModal>
    </Box>
  );
};

export default EmployeesPage;
