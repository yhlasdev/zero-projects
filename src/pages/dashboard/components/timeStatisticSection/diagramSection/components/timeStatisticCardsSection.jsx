import { Box } from "@mui/material"
import { TimeStatisticCard } from "./timeStatisticCard"
import { useLocale } from "../../../../../../hooks/useLocale"


export const TimeStatisticCardsSection = ({ firstData, secondData, thirdData, fourthData, fiveData }) => {
    const { t } = useLocale();
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                height: '100px'
            }}>

            <TimeStatisticCard
                text={t('dashboard.totalCurrentMonth')}
                count={Math.ceil(firstData) || 0}
                subText={t('dashboard.hoursDisplay')}
            />

            <TimeStatisticCard
                text={t('dashboard.totalLastMonth')}
                count={Math.ceil(secondData) || 0}
                subText={t('dashboard.hoursDisplay')}
            />
            <TimeStatisticCard
                text={t('dashboard.avgCurrentMonth')}
                count={Math.ceil(thirdData) || 0}
                subText={t('dashboard.hoursPerDay')}
            />
            <TimeStatisticCard
                text={t('dashboard.change')}
                count={`+${Math.ceil(fourthData) || 0}`}
                subText={Math.ceil(fiveData) || 0}
                countColor={'#299764'}
                index={4}
            />

        </Box>
    )
}