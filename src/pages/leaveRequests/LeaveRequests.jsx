import { Box } from "@mui/material"
import { PageTitle } from "../../components/pageTitle/pageTitle";
import Header from "./components/Header";
import LeaveTable from "./components/LeaveTable";
import TablePaginationInfo from "../../components/table/TablePagination";
import LeaveRequestDetail from "./components/EditRequestContent";
import GlobalModal from "../../components/modal/GlobalModal";
import { useState } from "react";


const LeaveRequestsPage = () => {
    const [selectedRow, setSelectedRow] = useState(null);

    return (
        <Box className=' leaveRequest'>
            <PageTitle
                title="Leave Requests"
                subTitle="Review and manage employee leave requets"
            />
            <Header />
            <LeaveTable onView={(row) => setSelectedRow(row)} />
            <TablePaginationInfo total={12} />
            <GlobalModal
                open={Boolean(selectedRow)}
                onClose={() => setSelectedRow(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedRow && (
                    <LeaveRequestDetail
                        data={{
                            ...selectedRow,
                            balance: 15,
                            appliedDate: "2024-01-20",
                            reason: "Family vacation"
                        }}
                        onClose={() => setSelectedRow(null)}
                    />
                )}
            </GlobalModal>

        </Box>
    )
}

export default LeaveRequestsPage;