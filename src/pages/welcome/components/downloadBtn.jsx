import { Box, Button, Typography } from "@mui/material"


export const DownloadBtn = ({ logo, subtitle }) => {
    return (
        <Button
            className=" flex gap-3 p-3 pl-5 pr-5 h-[80px] w-[220px]"
            variant="contained"
            sx={{
                borderRadius: '15px',
                boxShadow: '0 8px 30px 0 rgba(15, 50, 84, 0.3)',
            }}
        >
            <Box sx={{ flex: 1 }}>
                <img src={logo} alt="" width={'58px'} height={58} />
            </Box>
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '11px', whiteSpace: 'nowrap', opacity: '80%' }} color="#FFFFFF"> Göçürip alyň</Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, whiteSpace: 'nowrap' }}> {subtitle}</Typography>
            </Box>
        </Button>
    )
}