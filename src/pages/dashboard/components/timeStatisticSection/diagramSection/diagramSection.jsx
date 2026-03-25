import { MenuItem, Box, Typography } from "@mui/material"
import { TimeStatisticCardsSection } from "./components/timeStatisticCardsSection"
import { Wrapper } from "../../../../../components/wrapper"
import ChartSection from "./components/chartComponent"
import DebounceSelect from "../../../../../components/select/DebounceSelect"
import { useQuery } from "@tanstack/react-query"
import { getAllDepartments, getDahsboardHourStat } from "../../../../../api/queries/getters"
import { useState } from "react"


export const DiagramSection = () => {
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
    });

    const TimeStatisticCardsSectionForData = responseData?.data?.data;

    return (
        <Wrapper sx={{
            borderRadius: '8px',
        }}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                    <Typography sx={{ fontWeight: 600, fontSize: '17.75px' }}> Her günki işlenen sagat sany </Typography>
                    <Box sx={{ width: '200px' }}>
                        <DebounceSelect
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            onClear={() => setSelectedDepartment("Ähli bölümler")}
                            placeholder="Saýlaň..."
                        >
                            <MenuItem value="Ähli bölümler">Ähli bölümler</MenuItem>
                            {isLoading ? (
                                <MenuItem disabled>Ýüklenýär...</MenuItem>
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
                <ChartSection />
            </Box>
        </Wrapper>
    )
}