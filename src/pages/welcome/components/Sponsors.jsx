import { Box, Typography } from "@mui/material"
import { SponsorItem } from "./sponsorItem";
import { useLocale } from "../../../hooks/useLocale";


import sponsorImage from '../../../assets/images/sponsor_image.png'

export const Sponsors = () => {
  const { t } = useLocale();
  return (

    <Box sx={{ width: '100%', height: '670px' }}>
      <Typography
        sx={{
          fontSize: '52px',
          fontWeight: 800,
          textAlign: 'center',
          paddingTop: '60px',
          paddingBottom: '80px'
        }} className=" main-color-text">{t('welcome.sponsors')}</Typography>


      <Box
        className=' -p-2 mt-5'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%'
        }}>
        {
          Array.from({ length: 6 }).map((index) => (
            <Box key={index} className=' w-1/3 p-5 '>
              <SponsorItem image_url={sponsorImage} />
            </Box>
          ))
        }
      </Box>
    </Box>
  );
};
