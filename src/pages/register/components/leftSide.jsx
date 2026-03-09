import { Box } from "@mui/material";
import overlayImage_reg_log from "../../../assets/images/overlay_image_log_reg.png";
import YerindeLogo from "../../login/components/YerindeLogo";

export const LeftSide = () => {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "40px",
        overflow: "hidden",
        height: "98%",
        width: "697px",
        my: "20px",
        ml: "20px",
        flexShrink: 0,
      }}
    >
      <img
        src={overlayImage_reg_log}
        alt="registration login overlay"
        width="100%"
        height="100%"
        style={{ objectFit: "cover", display: "block" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.9,
          width: "100%",
          height: "100%",
          backgroundColor: "#0F3254",
          zIndex: 999,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 99999,
        }}
      >
        <YerindeLogo />
      </Box>
    </Box>
  );
};
