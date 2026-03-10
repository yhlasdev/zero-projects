import { Box, Divider, Typography } from "@mui/material"
import { CustomDivider } from "../../../../../components/customDivider"
import { StatisticLine } from "./statisticLine"
import { Wrapper } from "../../../../../components/wrapper"
import dayjs from "dayjs"


export const MonthStatistic = ({ titleColor, title, data }) => {
    return (
        <Wrapper sx={{ flex: 1, p: 3, borderRadius: '8px' }}>
            <Box className=' flex flex-col gap-2 flex-1'>
                <Typography variant="h4" color={titleColor}> {title} </Typography>
                <CustomDivider />
                <StatisticLine
                    prefix={'In kop islenen gun'}
                    suffix={`${Math.ceil(data[0].suffix)} sagat`}
                    suffixUp={dayjs(data[0].suffixUp).format('DD.MM.YYYY')}
                />
                <Divider />
                <StatisticLine
                    prefix={'In az islenen gun'}
                    suffix={`${Math.ceil(data[1].suffix)} sagat`}
                    suffixUp={dayjs(data[1].suffixUp).format('DD.MM.YYYY')}
                />
                <Divider />
                <StatisticLine
                    prefix={'Ortaca gundelik'}
                    suffix={`${Math.ceil(data[2].suffix)} sagat`}
                    suffixUp={dayjs(data[2].suffixUp).format('DD.MM.YYYY')}
                />
                <Divider />
            </Box>
        </Wrapper>
    )
}