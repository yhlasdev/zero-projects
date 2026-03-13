import { Box } from "@mui/material";
import { useState } from "react";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import GlobalTable from "../../components/table/Table";
import EmployeeCell from "../../components/table/EmployeeCell";
import StatusChip from "../../components/table/StatusChip";
import TableActions from "../../components/table/TableActions";
import GlobalModal from "../../components/modal/GlobalModal";
import AddEmployeeContent from "./components/AddEmployeeContent";
import ViewEmployeeWeek from "./components/EmployeeDetailWeek";
import Header from './components/Header';
import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { getAllEmployee } from "../../api/queries/getters";
import EditEmployeeContent from "./components/EditEmployee";
import { useLocale } from "../../hooks/useLocale";


const EmployeesPage = () => {
  const { t } = useLocale();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [filters, setFilter] = useState({
    department_id: "",
    job_id: "",
    search: ""
  });

  const employeeQuery = useInfiniteGet({
    key: "employees",
    apiFn: getAllEmployee,
    limit: 10,
    filters,
    dataKey: "employees",
  });

  const columns = [
    {
      key: "employee_id",
      label: t('common.id'),
      render: (row) => row.employee_id,
    },
    {
      key: "employee",
      label: t('common.employee'),
      render: (row) => (
        <EmployeeCell
          name={`${row.user?.first_name} ${row.user?.last_name}`}
          avatar={null}
        />
      ),
    },
    {
      key: "title",
      label: t('common.title'),
      render: (row) => row.job?.title,
    },
    {
      key: "department",
      label: t('common.department'),
      render: (row) => row.department?.name,
    },
    {
      key: "nationality",
      label: t('common.nationality'),
      render: (row) => row.user?.nationality,
    },
    {
      key: "status",
      label: t('common.status'),
      render: (row) => <StatusChip status={row.is_active ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      label: t('common.actions'),
      render: (row) => (
        <TableActions
          onCalendar={() => {
            setSelectedEmployee(row);
            setOpenViewModal(true);
          }}
          onDelete={() => console.log('del')}
          onEdit={() => {
            setOpenEditModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <Box className="employees">
      {openViewModal ? (
        <ViewEmployeeWeek employee={selectedEmployee} />
      ) : (
        <>
          <PageTitle
            title={t('employees.title')}
            subTitle={t('employees.subtitle')}
          />
          <Header
            onAddClick={() => setOpenAddModal(true)}
            setFilter={setFilter}
            filters={filters}
          />
          <GlobalTable
            columns={columns}
            rows={employeeQuery?.data}
            onScroll={employeeQuery.handleScroll}
            isLoading={employeeQuery.isLoading}
            isFetchingNextPage={employeeQuery.isFetchingNextPage}
            isError={employeeQuery.isError}
            emptyMessage={t('employees.noRecords')}
          />

          {/* <TablePaginationInfo
            total={employeeQuery.totalItems}
          /> */}
        </>
      )}

      <GlobalModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <AddEmployeeContent
          onClose={() => setOpenAddModal(false)}
        />

      </GlobalModal>

      <GlobalModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <EditEmployeeContent
          onClose={() => setOpenEditModal(false)}
        />

      </GlobalModal>
    </Box>
  );
};

export default EmployeesPage;