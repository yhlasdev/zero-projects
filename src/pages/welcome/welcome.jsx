import { AppBar, Toolbar, Typography, Button, Box, Paper } from "@mui/material";
import { Banner } from "./components/Banner";

import logo from "../../assets/logo/logo.png";
import Features from "./components/Features";

import { About } from "./components/About";
import MobileDownload from "./components/MobileDownload";
import { VideoSection } from "./components/VideoSection";
import { Sponsors } from "./components/Sponsors";
import FieldLabel from "../../components/textField/WelcomeLabel";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ maxWidth: "1500px", mx: "auto", height: "85px" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            <img src={logo} />
          </Typography>

          <Box>
            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              sx={{
                width: "108px",
                height: "55px",
                mr: 2,
                textTransform: "none",
                borderRadius: "50px",
                border: "2px solid #0F3254",
                color: "#0F3254",
                fontWeight: 700,
                fontSize: "16px",
                "&:hover": {
                  border: "2px solid #0F3254",
                  backgroundColor: "rgba(15,50,84,0.05)",
                },
              }}
            >
              Giriş
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="contained"
              sx={{
                width: "165px",
                height: "55px",
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "16px",
                background:
                  "linear-gradient(108.43deg, #0F3254 0%, #1A4D7A 100%)",
                boxShadow: "0px 4px 15px rgba(15,50,84,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(108.43deg, #0F3254 0%, #1A4D7A 100%)",
                  boxShadow: "0px 6px 20px rgba(15,50,84,0.35)",
                },
              }}
            >
              Registrasiýa
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        sx={{
          py: 20,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(90deg,#e9f1ff,#f9eaff)",
        }}
      >
        {/* Shape 1 */}
        <Box
          sx={{
            position: "absolute",
            width: "300px",
            height: "300px",
            top: "23px",
            left: "90px",
            borderRadius: "150px",
            opacity: 0.1,
            transform: "rotate(2.15deg)",
            background: "linear-gradient(135deg,#667EEA,#764BA2)",
          }}
        />

        {/* Shape 2 */}
        <Box
          sx={{
            position: "absolute",
            width: "250px",
            height: "250px",
            top: "430px",
            left: "281px",
            opacity: 0.1,
            transform: "rotate(-2.15deg)",
            borderTopLeftRadius: "75px",
            borderTopRightRadius: "87.5px",
            borderBottomRightRadius: "175px",
            borderBottomLeftRadius: "162.5px",
            background: "linear-gradient(135deg,#0F3254,#1A4D7A)",
          }}
        />

        {/* Shape 3 */}
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            top: "470px",
            right: "100px",
            borderRadius: "100px",
            opacity: 0.1,
            transform: "rotate(2.85deg)",
            background: "linear-gradient(135deg,#F093FB,#F5576C)",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            maxWidth: "1500px",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            px: 3,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left Side */}
          <Box className="w-full md:w-1/2">
            <Typography
              fontWeight={800}
              sx={{
                fontSize: "64px",
                lineHeight: 1.1,
                color: 'linear-gradient(102.79deg, #0F3254 0%, #1A4D7A 100%)',
                 background: 'linear-gradient(102.79deg, #0F3254 0%, #1A4D7A 100%)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
              }}
            >
              Ýerinde bilen <br />
              işiňizi hasaba alyň
            </Typography>

            <Box height={20} />

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                maxWidth: "500px",
                color: "#4a5568",
              }}
            >
              Häzirki zaman çözgütler bilen işiňizi aňsatlykda dolandyryň.
              <br />
              Yerinde siziň işgäriňiziň haýsydyr bir ýerinde bolsun, size kömek
              edýär.
            </Typography>

            <Button
              variant="contained"
              sx={{
                width: "192px",
                height: "60px",
                borderRadius: "50px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                background:
                  "linear-gradient(107.36deg, #0F3254 0%, #1A4D7A 100%)",
                boxShadow: "0px 10px 40px rgba(15,50,84,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(107.36deg, #0F3254 0%, #1A4D7A 100%)",
                  boxShadow: "0px 12px 45px rgba(15,50,84,0.35)",
                },
              }}
              endIcon={<MdOutlineArrowRightAlt />}
            >
              Başlamak
            </Button>
          </Box>

          {/* Right Side */}
          <Box className="w-full md:w-1/2 flex justify-center">
            <Banner />
          </Box>
        </Box>
      </Box>

      <Box className="bg-white" sx={{ maxWidth: "1500px", mx: "auto" }}>
        <Features />
        <Box mb={20}></Box>
        <Box
          sx={{
            width: "144px",
            height: "41px",
            borderRadius: "50px",
            background: "#0F32541A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: "18%",
          }}
        >
          <Typography
            sx={{
              color: "#0F3254",
              fontWeight: 700,
              letterSpacing: "3px",
              fontSize: "14px",
            }}
          >
            BIZ BARADA
          </Typography>
        </Box>
        <About />
        <MobileDownload />
        <Box mb={20}></Box>
        <Box textAlign={"center"} width={"100%"} mx={"auto"} display={"flex"}>
          <Typography
            fontWeight={800}
            width={914}
            textAlign={"center"}
            fontSize={52}
            color="#0F3254"
            ml={"17%"}
          >
            Mobil programmany nädip ulanmalydygyny öwreniň
          </Typography>
        </Box>
        <Box textAlign={"center"} ml={"23%"} mt={3} mb={8}>
          <Typography
            color="#666666"
            fontSize={20}
            width={750}
            textAlign={"center"}
          >
            Aşakdaky wideo sapaklar arkaly programmamyzy ädimme-ädim öwreniň we
            iş tertibiňizi şu gün gowulandyryp başlaň.
          </Typography>
        </Box>
        <VideoSection />
        <Box mb={15}></Box>
        <Sponsors />
        <Box mb={15}></Box>
      </Box>

      {/* CONTACT */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F3254, #1A4D7A)",
          height: "1152px",
        }}
      >
        <Typography
          sx={{ fontSize: "40px" }}
          fontWeight={800}
          align="center"
          color="white"
          gutterBottom
          paddingTop={"60px"}
        >
          Habarlaşmak
        </Typography>

        <Typography
          variant="body1"
          className="text-white text-center"
          mt={3}
          mb={5}
        >
          Soraglaryňyz bar bolsa bize ýazyň
        </Typography>

        <Paper
          sx={{
            p: 4,
            borderRadius: "30px",
            width: "900px",
            height: "800px",
            bgcolor: "#FFFFFFF",
            display: "flex",
            alignItems: "center",
            mx: "auto",
          }}
        >
          <Box mx={"auto"}>
            <form>
              <FieldLabel label={"Adyňyz"} />
              <FieldLabel label={"Email"} />
              <FieldLabel label={"Telefon belgi"} />
              <FieldLabel label={"Tema"} />
              <FieldLabel label={"Habar"} multiline rows={4} />

              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  width: "800px",
                  height: "60px",
                  borderRadius: "15px",
                  background: "linear-gradient(90deg, #0F3254, #1A4D7A)",
                  fontWeight: 700,
                  fontSize: 17,
                  mt: 12,
                }}
              >
                Ibermek
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>

      <Footer />
    </>
  );
};

export default Welcome;
