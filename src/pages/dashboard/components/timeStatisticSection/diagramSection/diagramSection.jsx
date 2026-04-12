import { MenuItem, Box, Typography } from "@mui/material"
import { TimeStatisticCardsSection } from "./components/timeStatisticCardsSection"
import { Wrapper } from "../../../../../components/wrapper"
import ChartSection from "./components/chartComponent"
import DebounceSelect from "../../../../../components/select/DebounceSelect"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllDepartments, getDahsboardHourStat } from "../../../../../api/queries/getters"
import { useState } from "react"
import { useLocale } from "../../../../../hooks/useLocale"


export const DiagramSection = () => {
    const { t } = useLocale();
    const [selectedDepartment, setSelectedDepartment] = useState("Ähli bölümler");

    const { data: response, isLoading } = useQuery({
        queryKey: ["departmentsForSelect"],
        queryFn: getAllDepartments
    });
    const allDepartments = response?.data?.data || [];

    const {
        data: responseData,
    } = useQuery({
        queryKey: ["dahsboardHourStatistic", selectedDepartment],
        queryFn: () => getDahsboardHourStat(selectedDepartment),
        placeholderData: keepPreviousData,
    });

    const TimeStatisticCardsSectionForData = responseData?.data?.data;

    return (
        <Wrapper sx={{
            borderRadius: '8px',
        }}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                    <Typography sx={{ fontWeight: 600, fontSize: '17.75px' }}> {t('dashboard.dailyWorkedHours')} </Typography>
                    <Box sx={{ width: '200px' }}>
                        <DebounceSelect
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            onClear={() => setSelectedDepartment("Ähli bölümler")}
                            placeholder={t('dashboard.selectPlaceholder')}
                            hasCancel={true}
                        >
                            <MenuItem value="Ähli bölümler">{t('dashboard.allDepartmentsLabel')}</MenuItem>
                            {isLoading ? (
                                <MenuItem disabled>{t('common.loading')}</MenuItem>
                            ) : (
                                allDepartments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))
                            )}
                        </DebounceSelect>
                    </Box>
                </Box>
                <Box className='mb-2' />
                <TimeStatisticCardsSection
                    firstData={TimeStatisticCardsSectionForData?.total_hours_30_to_60}
                    secondData={TimeStatisticCardsSectionForData?.total_hours_last_30}
                    thirdData={TimeStatisticCardsSectionForData?.avg_hours_last_30}
                    fourthData={TimeStatisticCardsSectionForData?.change_hours}
                    fiveData={TimeStatisticCardsSectionForData?.change_procent}
                />
                <Box className='mb-2' />
                <ChartSection
                    daily_hours_last_30={TimeStatisticCardsSectionForData?.daily_hours_last_30}
                    daily_hours_30_to_60={TimeStatisticCardsSectionForData?.daily_hours_30_to_60} />
            </Box>
        </Wrapper>
    )
}