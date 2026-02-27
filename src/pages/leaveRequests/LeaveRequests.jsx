import { Box } from "@mui/material"
import { PageTitle } from "../../components/pageTitle/pageTitle";
import Header from "./components/Header";
import LeaveTable from "./components/LeaveTable";
import TablePaginationInfo from "../../components/table/TablePagination";
import LeaveRequestDetail from "./components/EditRequestContent";
import GlobalModal from "../../components/modal/GlobalModal";
import { useState } from "react";
import { useInfiniteGet } from "../../hooks/useInfiniteList";
import { getLeavesAll } from "../../api/queries/getters";
import { formatTimeYear } from "../../utils/formatTime";
import GlobalTable from "../../components/table/Table";
import StatusChip from "../../components/table/StatusChip";
import TableActions from "../../components/table/TableActions";


const LeaveRequestsPage = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [filters, _setFilters] = useState({
        status: "",
        type: "",
    });

    const leavesQuery = useInfiniteGet({
        key: ["leaves"],
        apiFn: ({ ...restFilters }) =>
            getLeavesAll({
                type: restFilters.type,
                status: restFilters.status,
            }),
        dataKey: "leaves",
        countKey: "total",
        filters,
    });

    const rows = leavesQuery.data.map((item) => ({
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
        { key: "employee", label: "Employee" },
        { key: "department", label: "Department" },
        {
            key: "type", label: "Type",
            render: (row) => <StatusChip status={row.type} />,
        },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "total_days", label: "Days" },
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
                    }}
                />
            ),
        },
    ];
    return (
        <Box className=' leaveRequest'>
            <PageTitle
                title="Leave Requests"
                subTitle="Review and manage employee leave requets"
            />
            <Header />
            <GlobalTable
                columns={columns}
                rows={rows}
                onScroll={leavesQuery.handleScroll}
                isLoading={leavesQuery.isLoading}
                isFetchingNextPage={leavesQuery.isFetchingNextPage}
                isError={leavesQuery.isError}
                emptyMessage="No Request records found"
            />

            <GlobalModal
                open={Boolean(selectedRow)}
                onClose={() => setSelectedRow(null)}
                maxWidth="md"
                fullWidth
            >
                <LeaveRequestDetail
                    leave_id={selectedRow?.leave_id}
                    onClose={() => { setSelectedRow(null), leavesQuery.refetch() }}
                />

            </GlobalModal>

        </Box>
    )
}

export default LeaveRequestsPage;