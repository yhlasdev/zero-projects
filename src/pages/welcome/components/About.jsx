import { Box, Button, Typography } from "@mui/material";

export const About = () => {
  return (
    <Box className="about flex flex-col items-center pb-15">
      <Typography
        sx={{
          fontSize: "52px",
          fontWeight: 800,
          textAlign: "center",
          py: 5,
        }}
        color="#0F3254"
      >
        Ýerinde barada
      </Typography>
      <Typography
        sx={{
          maxWidth: "800px",
          lineHeight: "36px",
        }}
        color="#333333"
        fontSize={20}
        textAlign={"center"}
      >
        Yerinde - bu häzirki zaman kompaniýalar üçin HR we işgärleriň iş
        tertibini dolandyrmak platformasydyr. Biziň maksadymyz kärhanalar üçin
        işgärlerini dolandyrmagy aňsatlaşdyrmak we wagtyňyzy tygşytlamakdyr.
        Sanly çözgütler bilen siz islendik ýerden işiňizi gözegçilikde saklap
        bilersiňiz.
      </Typography>
    </Box>
  );
};
