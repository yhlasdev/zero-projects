import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Paper,
} from "@mui/material";
import { Banner } from "./components/Banner";

import logo from '../../assets/logo/logo.png'
import Features from "./components/Features";

import { About } from "./components/About";
import MobileDownload from "./components/MobileDownload";
import { VideoSection } from "./components/VideoSection";
import { Sponsors } from './components/Sponsors'
import FieldLabel from "../../components/textField/LabelInput";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";

const Welcome = () => {

    const navigate = useNavigate();

    return (
        <>
            {/* HEADER */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ maxWidth: '1500px', mx: 'auto' }}>
                <Toolbar sx={{ justifyContent: "space-between", display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                        <img src={logo} />
                    </Typography>

                    <Box>
                        <Button
                            onClick={() => navigate('/login')}
                            variant="outlined"
                            sx={{
                                mr: 2,
                                textTransform: 'none',
                                borderRadius: '25px',
                                borderColor: '#2F4B53',
                                fontWeight: 700,
                                p: 1,
                                pl: 5,
                                pr: 5
                            }}>
                            Giriş
                        </Button>
                        <Button
                            onClick={() => navigate('/register')}
                            className=" main-color-bg text-white"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '25px',
                                p: 1,
                                pl: 5,
                                pr: 5
                            }}
                            variant="contained">
                            Registrasiýa
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* HERO */}
            <Box
                sx={{
                    py: 20,
                    background: "linear-gradient(90deg,#e9f1ff,#f9eaff)",
                }}
            >
                <Box sx={{ maxWidth: '1500px', mx: 'auto', display: 'flex', width: '100%' }}>
                    <Box className='w-full  md:w-1/2'>
                        <Typography
                            fontWeight={800}
                            className="main-color-text"
                            sx={{
                                fontSize: "50px",
                                lineHeight: 1.1,
                            }}
                        >
                            Yerinde bilen <br />
                            işiňizi hasaba alyň
                        </Typography>
                        <br />
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Häzirki zaman çözgütler bilen işiňizi aňsatlykda dolandyryň. <br />
                            Yerinde siziň işgäriňiziň haýsydyr bir ýerinde bolsun, size kömek edýär.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: '25px'
                            }}>
                            Başlamak
                        </Button>
                    </Box>

                    <Box className=' w-full  md:w-1/2'>
                        <Banner />
                    </Box>
                </Box>
            </Box>

            <Box className=' bg-white' sx={{ maxWidth: '1500px', mx: 'auto' }} >
                <Features />
                <Box mb={10} ></Box>
                <About />
                <MobileDownload />
                <Box mb={10}></Box>
                <VideoSection />
                <Box mb={10}></Box>
                <Sponsors />
                <Box mb={10}></Box>
            </Box>

            {/* CONTACT */}
            < Box sx={{ py: 10, backgroundColor: "#0d1b2a" }}>
                <Container maxWidth="sm">
                    <Typography
                        sx={{ fontSize: '40px' }}
                        fontWeight={800}
                        align="center"
                        color="white"
                        gutterBottom
                    >
                        Habarlaşmak
                    </Typography>

                    <Typography variant="body1" className="text-white text-center" mb={5}> Soraglaryňyz bar bolsa bize ýazyň  </Typography>

                    <Paper sx={{ p: 4, borderRadius: 4 }}>
                        <Box component="form" display="flex" flexDirection="column" gap={2}>
                            <form>
                                <FieldLabel label={'Adyňyz'} />
                                <FieldLabel label={'Email'} />
                                <FieldLabel label={'Telefon belgi'} />
                                <FieldLabel label={'Tema'} />
                                <FieldLabel label={'Habar'} multiline rows={4} />
                            </form>

                            <Button variant="contained" size="large" sx={{ textTransform: 'none' }}>
                                Ibermek
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box >

            <Footer />
        </>
    );
};

export default Welcome;