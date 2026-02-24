import { Box, Card, Typography } from "@mui/material"

export const TwoSectionCard = ({ icon, title, description }) => {
    const Icon = icon;
    return (
        <Card
            className="flex flex-col gap-3 p-10 rounded-xl"
            sx={{ maxWidth: '300px', mt: '-20px', alignItems: 'flex-start' }}
        >
            <Box
                className='main-color-bg'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'fit-content',
                    p: 1,
                    borderRadius: '15px',
                    color: 'white'
                }}>
                <Icon className=' text-white text-[40px]' />
            </Box>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body1">{description}</Typography>
        </Card>
    )
}