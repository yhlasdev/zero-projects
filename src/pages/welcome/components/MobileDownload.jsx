import { Box, Typography } from "@mui/material";

import playstore from '../../../assets/logo/playstore.png'
import appstore from '../../../assets/logo/appstore.png'
import kod from '../../../assets/logo/kod.png'
import { DownloadBtn } from "./downloadBtn";

const MobileDownload = () => {
  return (
    <Box className="mobile" mt={15}>
      <Typography
        sx={{
          fontSize: '40px',
          fontWeight: 800,
          textAlign: 'center'
        }} className=" main-color-text">Mobile programmany göçürip alyň </Typography>
      <Typography variant="body1" className=" text-center" mt={3}>  islendik ýerde, islendik wagtda giriş </Typography>
      <Box className='flex justify-center' mt={5}>
        <img src={kod} alt="" />
      </Box>
      <Box className="download-buttons flex gap-5 justify-center" mt={5}>
        <DownloadBtn logo={appstore} subtitle={'App Store'} />
        <DownloadBtn logo={playstore} subtitle={'Google Play'} />
      </Box>
    </Box>
  );
};

export default MobileDownload;