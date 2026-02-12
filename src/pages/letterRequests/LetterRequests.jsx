import { Box, Divider } from "@mui/material"
import { PageTitle } from "../../components/pageTitle/pageTitle";
import Header from "./components/Header";
import RequestCard from "./components/LetterTable";
import TablePaginationInfo from "../../components/table/TablePagination";
import GlobalModal from "../../components/modal/GlobalModal";
import LetterContent from "./components/LetterContent";
import { useState } from "react";

const requests = [
    {
        id: 1,
        title: "Salary Review Request",
        type: "Salary",
        status: "Pending",
        name: "James Thompson",
        department: "Sales",
        date: "2024-01-22",
        description:
            "I would like to request a salary review based on my performance over the past year and increased responsibilities.",
        hasAttachment: false
    },
    {
        id: 2,
        title: "Workplace Equipment Issue",
        type: "Complaint",
        status: "Accepted",
        name: "Rachel Green",
        department: "Engineering",
        date: "2024-01-18",
        description:
            "The air conditioning in the engineering department has not been working properly for the past two weeks.",
        hasAttachment: false
    },
    {
        id: 3,
        title: "Department Transfer Request",
        type: "Transfer",
        status: "Pending",
        name: "Kevin Park",
        department: "Marketing",
        date: "2024-01-20",
        description:
            "I would like to request a transfer to the Product team to work more closely on product marketing and strategy.",
        hasAttachment: true
    }
];


const LetterRequestsPage = () => {
    const [selectedRow, setSelectedRow] = useState(null);

    return (
        <Box className=' letterRequests'>
            <PageTitle
                title="Letter Requests"
                subTitle="Manage employee letters and communications"
            />
            <Header />
            <Divider />
            <Box sx={{
                backgroundColor: '#fff', padding: 3, overflow: 'auto', height: "calc(100vh - 367px)"
            }}>
                {requests.map((request) => (
                    <RequestCard
                        key={request.id}
                        title={request.title}
                        type={request.type}
                        status={request.status}
                        name={request.name}
                        department={request.department}
                        date={request.date}
                        description={request.description}
                        hasAttachment={request.hasAttachment}
                        onViewDetails={() => setSelectedRow(request)}
                    />
                ))}
            </Box>
            <TablePaginationInfo />

            <GlobalModal
                open={Boolean(selectedRow)}
                onClose={() => setSelectedRow(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedRow && (
                    <LetterContent
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

export default LetterRequestsPage; 