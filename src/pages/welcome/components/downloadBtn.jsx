import { Box, Button, Typography } from "@mui/material"


export const DownloadBtn = ({ logo, subtitle }) => {
    return (
        <Button
            className=" flex gap-3 p-3 pl-5 pr-5"
            variant="contained"
            sx={{
                borderRadius: '15px'
            }}
        >
            <Box sx={{ flex: 1 }}>
                <img src={logo} alt="" width={'30px'} />
            </Box>
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '8px', whiteSpace: 'nowrap' }}> Göçürip alyň</Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}> {subtitle}</Typography>
            </Box>
        </Button>
    )
}