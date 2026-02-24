
import { Box } from "@mui/material"

export const SponsorItem = ({ image_url }) => {
    return (
        <Box
            className=' w-full '
            sx={{
                borderRadius: '10px',
                boxShadow: '2px 2px 10px #eeeeee,-2px -2px 10px #eeeeee',
                p: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <img src={image_url} />
        </Box>
    )
}