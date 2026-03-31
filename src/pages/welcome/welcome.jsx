import { AppBar, Toolbar, Typography, Button, Box, Paper } from "@mui/material";

import Features from "./components/Features";

import { About } from "./components/About";
import MobileDownload from "./components/MobileDownload";
import { VideoSection } from "./components/VideoSection";
import { Sponsors } from "./components/Sponsors";
import FieldLabel from "../../components/textField/WelcomeLabel";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useLocale } from "../../hooks/useLocale";
import { BrandLogo } from "../../utils/Icon";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendContactMessage } from "../../api/queries/post";
import Seo from "../../components/seo/seo";

const schema = yup.object().shape({
  name: yup.string().required("Adyňyz hökmany"),
  email: yup.string().email("Nädogry e-poçta").required("E-poçta hökmany"),
  number: yup.string().optional(),
  text: yup.string().required("Habar hökmany"),
});

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      text: "",
    },
  });

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast.success(t("welcome.contactAlert", { defaultValue: "Habaryňyz iberildi!" }));
      reset();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Näsazlyk ýüze çykdy.";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    console.log('this-data-----', data);
    mutation.mutate(data);
  };

  return (
    <Paper sx={{ bgcolor: "#fff", fontFamily: "'Poppins', sans-serif" }}>
      <Seo
        title={t("sidebar.title") + " - Hoş geldiňiz"}
        description={t("welcome.videoSubtitle")}
        name="Yerinde"
        type="website"
      />
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
            <BrandLogo />
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
              {t("login.submit")}
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
              {t("register.submit")}
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
            top: "490px",
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

        <Box
          sx={{
            maxWidth: "1500px",
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "start",
            justifyContent: "space-between",
            width: "100%",
            px: { xs: 2, md: 6 },
            py: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" }, textAlign: "left" }}>
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "64px",
                lineHeight: "70.4px",
                letterSpacing: "0%",
                background:
                  "linear-gradient(102.79deg, #0F3254 0%, #1A4D7A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              {t("welcome.heroTitle", {
                defaultValue: "Ýerinde bilen işiňizi hasaba alyň",
              })}
            </Typography>

            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "34px",
                color: "#333333",
                maxWidth: "540px",
                mb: 5,
              }}
            >
              {t("welcome.heroSubtitle", {
                defaultValue:
                  "Häzirki zaman çözgütler bilen işiňizi aňsatlykda dolandyryň. Yerinde siziň işgäriňiziň haýsydyr bir ýerinde bolsun, size kömek edýär.",
              })}
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
                fontFamily: "'Poppins', sans-serif",
                background:
                  "linear-gradient(107.36deg, #0F3254 0%, #1A4D7A 100%)",
                boxShadow: "0px 10px 30px rgba(15,50,84,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(107.36deg, #0F3254 0%, #1A4D7A 100%)",
                  boxShadow: "0px 12px 40px rgba(15,50,84,0.4)",
                },
              }}
              endIcon={<MdOutlineArrowRightAlt style={{ fontSize: 24 }} />}
            >
              {t("welcome.getStarted", { defaultValue: "Başlamak" })}
            </Button>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              justifyContent: "center",
              mt: { xs: 8, md: 0 },
            }}
          >
            <Box
              sx={{
                width: "607px",
                height: "438px",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0px 20px 50px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="/banner.jpg"
                alt="Hero"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
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
            {t("welcome.aboutUs", { defaultValue: "BIZ BARADA" })}
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
            {t("welcome.videoTitle", {
              defaultValue: "Mobil programmany nädip ulanmalydygyny öwreniň",
            })}
          </Typography>
        </Box>
        <Box textAlign={"center"} ml={"23%"} mt={3} mb={8}>
          <Typography
            color="#666666"
            fontSize={20}
            width={750}
            textAlign={"center"}
          >
            {t("welcome.videoSubtitle", {
              defaultValue:
                "Aşakdaky wideo sapaklar arkaly programmamyzy ädimme-ädim öwreniň we iş tertibiňizi şu gün gowulandyryp başlaň.",
            })}
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
          {t("welcome.contact")}
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
            bgcolor: "#FFFFFFFA",
            opacity: '98%',
            display: "flex",
            alignItems: "center",
            mx: "auto",
          }}
        >
          <Box mx={"auto"} marginBottom={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <FieldLabel
                    {...field}
                    label={t("register.name", { defaultValue: "Adyňyz" })}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <FieldLabel
                    {...field}
                    label="Email"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="number"
                control={control}
                render={({ field, fieldState }) => (
                  <FieldLabel
                    {...field}
                    label="Telefon belgi"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              {/*   <Controller
                name="subject"
                control={control}
                render={({ field, fieldState }) => (
                  <FieldLabel
                    {...field}
                    label="Tema"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              /> */}
              <Controller
                name="text"
                control={control}
                render={({ field, fieldState }) => (
                  <FieldLabel
                    {...field}
                    label="Habar"
                    multiline
                    maxRows={4}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isPending}
                sx={{
                  textTransform: "none",
                  width: "800px",
                  height: "60px",
                  borderRadius: "15px",
                  background: "linear-gradient(90deg, #0F3254, #1A4D7A)",
                  fontWeight: 700,
                  fontSize: 17,
                  mt: 4,
                }}
              >
                {mutation.isPending ? "..." : t("welcome.send")}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>

      <Footer />
    </Paper>
  );
};

export default Welcome;
