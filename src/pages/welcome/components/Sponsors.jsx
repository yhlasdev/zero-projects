import { Box, Typography } from "@mui/material"
import { SponsorItem } from "./sponsorItem";

import sponsorImage from '../../../assets/images/sponsor_image.png'

export const Sponsors = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontSize: '40px',
          fontWeight: 800,
          textAlign: 'center'
        }} className=" main-color-text">Biziň hyzmatdaşlarymyz</Typography>

      <Box
        className=' -p-2 mt-5'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%'
        }}>
        {
          Array.from({ length: 6 }).map((index) => (
            <Box key={index} className=' w-1/3 p-2 '>
              <SponsorItem image_url={sponsorImage} />
            </Box>
          ))
        }
      </Box>
    </Box>
  );
};
