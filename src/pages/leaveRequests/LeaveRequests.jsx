import { Box } from "@mui/material";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import Header from "./components/Header";
import LeaveRequestDetail from "./components/EditRequestContent";
import GlobalModal from "../../components/modal/GlobalModal";
import { useState } from "react";
import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { getLeavesAll } from "../../api/queries/getters";
import { formatTimeYear } from "../../utils/formatTime";
import GlobalTable from "../../components/table/Table";
import StatusChip from "../../components/table/StatusChip";
import TableActions from "../../components/table/TableActions";
import { useLocale } from "../../hooks/useLocale";
import Seo from "../../components/seo/seo";


const LeaveRequestsPage = () => {
  const { t } = useLocale();
  const [selectedRow, setSelectedRow] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    type: "",
  });

  const leavesQuery = useInfiniteGet({
    key: ["leaves"],
    apiFn: getLeavesAll,
    dataKey: "leaves",
    countKey: "total",
    filters,
  });

  const rows = leavesQuery?.data?.map((item) => ({
    leave_id: item.leave_id,
    employee: `${item.user?.first_name || "-"} ${item.user?.last_name || "-"}`,
    department: item.department?.name || "-",
    type: item.leave_type || "-",
    start_date: formatTimeYear(item.start_date),
    end_date: formatTimeYear(item.end_date),
    total_days: item.total_days || "-",
    status: item.status || "-",
  }));

  const columns = [
    { key: "employee", label: t('common.employee') },
    { key: "department", label: t('common.department') },
    {
      key: "type",
      label: t('leaveRequests.leaveType'),
      render: (row) => <StatusChip status={row.type} />,
    },
    { key: "start_date", label: t('leaveRequests.startDate') },
    { key: "end_date", label: t('leaveRequests.endDate') },
    { key: "total_days", label: t('leaveRequests.days') },
    {
      key: "status",
      label: t('common.status'),
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "actions",
      label: t('common.actions'),
      render: (row) => (
        <TableActions
          onView={() => {
            setSelectedRow(row);
          }}
        />
      ),
    },
  ];
  return (
    <Box className=" leaveRequest">
      <Seo
        title={t("leaveRequests.title")}
        description={t("leaveRequests.subtitle")}
        name="Yerinde"
        type="website"
      />
      <PageTitle
        title={t('leaveRequests.title')}
        subTitle={t('leaveRequests.subtitle')}
      />

      <Header setFilter={setFilters} filters={filters} />
      <GlobalTable
        columns={columns}
        rows={rows || []}
        onScroll={leavesQuery.handleScroll}
        isLoading={leavesQuery.isLoading}
        isFetchingNextPage={leavesQuery.isFetchingNextPage}
        isError={leavesQuery.isError}
        emptyMessage={t('employees.noRecords')}
      />


      <GlobalModal
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        width={896}
      >
        <LeaveRequestDetail
          leave_id={selectedRow?.leave_id}
          onClose={() => {
            (setSelectedRow(null), leavesQuery.refetch());
          }}
        />
      </GlobalModal>
    </Box>
  );
};

export default LeaveRequestsPage;
