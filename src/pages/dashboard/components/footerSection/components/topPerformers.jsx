import {
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Box
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllTopPerformers } from "../../../../../api/queries/getters";


const getRankColor = (rank) => {
    if (rank === 1) return "#FFF3CD";
    if (rank === 2) return "#E0E0E0";
    if (rank === 3) return "#FDE8D0";
    return "transparent";
};

import { useLocale } from "../../../../../hooks/useLocale";

export const TopPerformers = () => {
    const { t } = useLocale();

    const { data: topPerformers = [], isLoading, isError } = useQuery({
        queryKey: ['topPerformers'],
        queryFn: async () => {
            const response = await getAllTopPerformers();
            return response.data;
        }
    });

    const allTopPerformers = topPerformers?.data || [];


    return (
        <Card sx={{ p: 3, borderRadius: '8px' }}>
            <Typography variant="h5" mb={2}>
                {t('dashboard.topPerformers')}
            </Typography>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('dashboard.rank')}</TableCell>
                            <TableCell>{t('common.employee')}</TableCell>
                            <TableCell>{t('common.department')}</TableCell>
                            <TableCell>{t('common.title')}</TableCell>
                            <TableCell align="right">{t('dashboard.hours')}</TableCell>
                        </TableRow>
                    </TableHead>

                    {isLoading ? (
                        <Box>{t('common.loading')}</Box>
                    ) : isError ? (
                        <Box>{t('common.error')}</Box>
                    ) : null}

                    <TableBody>
                        {allTopPerformers.map((emp) => (
                            <TableRow key={emp.rank} hover>
                                {/* Rank */}
                                <TableCell>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            bgcolor: getRankColor(emp.rank),
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600
                                        }}
                                    >
                                        {emp.rank}
                                    </Box>
                                </TableCell>

                                {/* Employee */}
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar src={`http://194.156.117.223:8004/yerinde/storage-service/attendances/${emp.employee_id}`} />
                                        <Typography fontWeight={600}>
                                            {emp.first_name}
                                        </Typography>
                                        <Typography fontWeight={600}>
                                            {emp.last_name}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell>{emp.department}</TableCell>
                                <TableCell>{emp.job}</TableCell>

                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {emp.hours.toFixed(1)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
