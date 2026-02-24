import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Box,
    TextField,
    Paper,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Banner } from "./components/Banner";

import logo from '../../assets/logo/logo.png'
import Features from "./components/Features";

import { About } from "./components/About";
import MobileDownload from "./components/MobileDownload";
import { VideoSection } from "./components/VideoSection";

const Welcome = () => {
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
                <VideoSection />
            </Box>

            {/* VIDEO SECTION */}
            < Box sx={{ py: 10, backgroundColor: "#f5f7fa" }}>
                <Container>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        align="center"
                        gutterBottom
                    >
                        Programmanyň nähili işleýändigini öwreniň
                    </Typography>

                    <Paper
                        elevation={4}
                        sx={{
                            height: 250,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 4,
                            mt: 4,
                        }}
                    >
                        <PlayArrowIcon sx={{ fontSize: 60 }} />
                    </Paper>
                </Container>
            </Box >

            {/* SPONSORS */}
            < Container sx={{ py: 10 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    align="center"
                    gutterBottom
                >
                    Biziň hyzmatdaşlarymyz
                </Typography>

                <Grid container spacing={4} mt={3}>
                    {["Google", "Amazon", "Google", "Amazon"].map((item, i) => (
                        <Grid item xs={6} md={3} key={i}>
                            <Paper
                                elevation={2}
                                sx={{
                                    py: 4,
                                    textAlign: "center",
                                    borderRadius: 3,
                                }}
                            >
                                <Typography variant="h6">{item}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container >

            {/* CONTACT */}
            < Box sx={{ py: 10, backgroundColor: "#0d1b2a" }}>
                <Container maxWidth="sm">
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        align="center"
                        color="white"
                        gutterBottom
                    >
                        Habarlasma
                    </Typography>

                    <Paper sx={{ p: 4, borderRadius: 4 }}>
                        <Box component="form" display="flex" flexDirection="column" gap={2}>
                            <TextField label="Adyňyz" fullWidth />
                            <TextField label="Email" fullWidth />
                            <TextField label="Telefon" fullWidth />
                            <TextField label="Tema" fullWidth />
                            <TextField label="Habar" multiline rows={4} fullWidth />

                            <Button variant="contained" size="large">
                                Ibermek
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box >

            {/* FOOTER */}
            < Box sx={{ py: 4, backgroundColor: "#08121c" }}>
                <Container>
                    <Typography align="center" color="white">
                        © 2025 Yerinde. Ähli hukuklar goralan.
                    </Typography>
                </Container>
            </Box >
        </>
    );
};

export default Welcome;