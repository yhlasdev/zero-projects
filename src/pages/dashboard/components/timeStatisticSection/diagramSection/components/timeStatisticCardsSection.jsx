import { Box } from "@mui/material"
import { TimeStatisticCard } from "./timeStatisticCard"


export const TimeStatisticCardsSection = ({ firstData, secondData, thirdData, fourthData, fiveData }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                height: '100px'
            }}>

            <TimeStatisticCard
                text={'Jemi (şu aý)'}
                count={Math.ceil(firstData) || 0}
                subText={'sagat'}
            />

            <TimeStatisticCard
                text={'Jemi (geçen aý)'}
                count={Math.ceil(secondData) || 0}
                subText={'sagat'}
            />
            <TimeStatisticCard
                text={'Ortaça (şu aý)'}
                count={Math.ceil(thirdData) || 0}
                subText={'sagat/gün'}
            />
            <TimeStatisticCard
                text={'Üýtgeşme'}
                count={`+${Math.ceil(fourthData) || 0}`}
                subText={Math.ceil(fiveData) || 0}
                countColor={'#299764'}
                index={4}
            />

        </Box>
    )
}