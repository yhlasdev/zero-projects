import { Box } from "@mui/material"
import overlayImage_reg_log from '../../../assets/images/overlay_image_log_reg.png'
import yerindeLogo from '../../../assets/logo/Yerinde_log_reg.png'


export const LeftSide = () => {
    return (
        <Box sx={{ position: 'relative', borderRadius: '15px', overflow: 'hidden' }}>
            <img src={overlayImage_reg_log} alt="" style={{ aspectRatio: '1/1' }} />
            <Box sx={{ position: 'absolute', top: 0, left: 0, opacity: '0.9', width: '100%', height: '100%', backgroundColor: '#1A4D7A', zIndex: '999' }}>
            </Box>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
                <img src={yerindeLogo} alt="" />
            </Box>
        </Box>

    )
}