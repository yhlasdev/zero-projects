import { Box, Typography } from "@mui/material"


export const StatisticLine = ({ prefix, suffix, suffixUp }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Typography variant="body1"> {prefix} </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" textAlign={'right'}> {suffixUp} </Typography>
                <Typography variant="body1" textAlign={'right'}> {suffix} </Typography>
            </Box>
        </Box>
    )
}