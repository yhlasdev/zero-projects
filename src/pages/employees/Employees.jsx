import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import GlobalTable from "../../components/table/Table";
import TablePaginationInfo from "../../components/table/TablePagination";
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


const EmployeesPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [filters, setFilter] = useState({
    department_id: "",
    status: "",
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
      label: "ID",
      render: (row) => row.employee_id,
    },
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <EmployeeCell
          name={`${row.user?.first_name} ${row.user?.last_name}`}
          avatar={null}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (row) => row.job?.title,
    },
    {
      key: "department",
      label: "Department",
      render: (row) => row.department?.name,
    },
    {
      key: "nationality",
      label: "Nationality",
      render: (row) => row.user?.nationality,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusChip status={row.is_active ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          onView={() => {
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
            title="Employee"
            subTitle="Manage employee information and profiles"
          />
          <Header
            onAddClick={() => setOpenAddModal(true)}
            setFilter={setFilter}
            filters={filters}
          />
          <Box
            onScroll={employeeQuery.handleScroll}
            sx={{
              height: "calc(100vh - 367px)",
              overflowY: "auto",
            }}
          >
            <GlobalTable
              columns={columns}
              rows={employeeQuery.data}
            />

            {employeeQuery.isLoading && (
              <Box textAlign="center" py={2}>
                <CircularProgress />
              </Box>
            )}

            {employeeQuery.isFetchingNextPage && (
              <Box textAlign="center" py={2}>
                <CircularProgress />
              </Box>
            )}
          </Box>

          <TablePaginationInfo
            total={employeeQuery.totalItems}
          />
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