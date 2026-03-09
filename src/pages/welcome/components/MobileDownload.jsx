import { Box, Typography } from "@mui/material";

import playstore from "../../../assets/logo/playstore.png";
import appstore from "../../../assets/logo/appstore.png";
import kod from "../../../assets/logo/kod.png";
import { DownloadBtn } from "./downloadBtn";

const MobileDownload = () => {
  return (
    <Box className="mobile" mt={15}>
      <Typography
        sx={{
          fontSize: "52px",
          fontWeight: 800,
          textAlign: "center",
        }}
        color="#0F3254"
      >
        Mobile programmany göçürip alyň
      </Typography>
      <Typography variant="body1" className=" text-center" fontSize={20} mt={3} color="#666666">
        Islendik ýerde, islendik wagtda giriş{" "}
      </Typography>
      <Box className="flex justify-center" mt={5} width={220} height={220} mx={'auto'} sx={{boxShadow: '0 8px 30px 0 rgba(15, 50, 84, 0.3)'}}>
        <img src={kod} alt="kod" width={220} height={220} />
      </Box>
      <Box className="download-buttons flex gap-5 justify-center" mt={5}>
        <DownloadBtn logo={appstore} subtitle={"App Store"} />
        <DownloadBtn logo={playstore} subtitle={"Google Play"} />
      </Box>
    </Box>
  );
};

export default MobileDownload;
