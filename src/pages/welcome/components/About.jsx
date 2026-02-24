import { Box, Typography } from "@mui/material";

export const About = () => {
    return (
        <Box className="about flex flex-col items-center">
            <Typography
                sx={{
                    fontSize: '40px',
                    fontWeight: 800,
                    textAlign: 'center'
                }} className=" main-color-text">Ýerinde barada</Typography>
            <Typography
                variant="body1"
                sx={{
                    maxWidth: '700px'
                }}>
                Yerinde - bu häzirki zaman kompaniýalar üçin HR we işgärleriň iş tertibini dolandyrmak
                platformasydyr. Biziň maksadymyz kärhanalar üçin işgärlerini dolandyrmagy
                aňsatlaşdyrmak we wagtyňyzy tygşytlamakdyr. Sanly çözgütler bilen siz islendik ýerden
                işiňizi gözegçilikde saklap bilersiňiz.
            </Typography>
        </Box>
    );
};
