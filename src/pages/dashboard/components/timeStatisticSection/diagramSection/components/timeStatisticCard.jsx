import { Box, Card, CardContent, Typography } from "@mui/material"


export const TimeStatisticCard = ({ text, count, subText, countColor, index }) => {
    return (
        <Card sx={{ flex: 1 }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: 'flex-start'
            }}>
                <Typography variant="body2" sx={{ fontSize: '10.65px' }}> {text}  </Typography>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-end'
                }}>
                    <Box sx={{ fontWeight: '700', fontSize: '21.3px', color: countColor }} > {count} </Box>
                    <Typography variant="body1" sx={{ color: countColor ? countColor : '#9F9F9F', fontSize: '10.65px' }} > {index == 4 ? `+${subText}%` : subText} </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}