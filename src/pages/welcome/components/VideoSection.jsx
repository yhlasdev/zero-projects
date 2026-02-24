import { Box, Typography } from "@mui/material"

export const VideoSection = () => {
  return (
    <Box mt={15}>
      <Typography
        sx={{
          fontSize: '40px',
          fontWeight: 800,
          textAlign: 'center'
        }} className=" main-color-text"> Mobil programmany nädip <br />
        ulanmalydygyny öwreniň</Typography>
      <Typography variant="body1" className=" text-center" mt={3}>Aşakdaky wideo sapaklar arkaly programmamyzy ädimme-ädim <br />
        öwreniň we iş tertibiňizi şu gün gowulandyryp başlaň. </Typography>

      <Box className='flex gap-5'>
        <Box>
          <video src=""></video>
        </Box>
        <Box>

        </Box>
      </Box>
    </Box>
  );
};
