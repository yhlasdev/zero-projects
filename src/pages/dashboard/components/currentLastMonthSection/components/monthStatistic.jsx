import { Box, Divider, Typography } from "@mui/material"
import { CustomDivider } from "../../../../../components/customDivider"
import { StatisticLine } from "./statisticLine"
import { Wrapper } from "../../../../../components/wrapper"
import dayjs from "dayjs"
import { useLocale } from "../../../../../hooks/useLocale"


export const MonthStatistic = ({ titleColor, title, data }) => {
    const { t } = useLocale();
    return (
        <Wrapper sx={{ flex: 1, p: 3, borderRadius: '8px' }}>
            <Box className=' flex flex-col gap-2 flex-1'>
                <Typography variant="h4" color={titleColor}> {title} </Typography>
                <CustomDivider />
                <StatisticLine
                    prefix={t('dashboard.mostWorkedDay')}
                    suffix={`${Math.ceil(data[0].suffix)} ${t('dashboard.hoursDisplay')}`}
                    suffixUp={data[0].suffixUp ? dayjs(data[0].suffixUp).format('DD.MM.YYYY') : '-'}
                />
                <Divider />
                <StatisticLine
                    prefix={t('dashboard.leastWorkedDay')}
                    suffix={`${Math.ceil(data[1].suffix)} ${t('dashboard.hoursDisplay')}`}
                    suffixUp={data[1].suffixUp ? dayjs(data[1].suffixUp).format('DD.MM.YYYY') : '-'}
                />
                <Divider />
                <StatisticLine
                    prefix={t('dashboard.dailyAverage')}
                    suffix={`${Math.ceil(data[2].suffix)} ${t('dashboard.hoursDisplay')}`}
                    suffixUp={data[2].suffixUp ? dayjs(data[2].suffixUp).format('DD.MM.YYYY') : '-'}
                />
                <Divider />
            </Box>
        </Wrapper>
    )
}