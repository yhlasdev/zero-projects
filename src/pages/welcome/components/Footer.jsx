import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#071A26",
        color: "#9FB3C8",
        pt: { xs: 6, md: 10 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              sx={{
                color: "#6EC1FF",
                mb: 2,
                fontWeight: 600,
                fontSize: 20,
              }}
            >
              Ýerinde
            </Typography>

            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              Häzirki zaman HR we işgärleriň iş tertibini dolandyrmak
              platformasy.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterTitle text="Çözgütler" />

            <Stack spacing={1}>
              <FooterLink text="HR dolandyryş" />
              <FooterLink text="Iş tertibi we gatnaşyk" />
              <FooterLink text="Rugsatlar" />
              <FooterLink text="Hasabatlar" />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterTitle text="Kompaniýa" />

            <Stack spacing={1}>
              <FooterLink text="Biz barada" />
              <FooterLink text="Karýera" />
              <FooterLink text="Habarlar" />
              <FooterLink text="Habarlaşmak" />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterTitle text="Goldaw" />

            <Stack spacing={1}>
              <FooterLink text="Kömek merkezi" />
              <FooterLink text="Dokumentasiýa" />
              <FooterLink text="Gizlinlik syýasaty" />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 6, mb: 4, borderColor: "#183546" }} />

        <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
          © 2025 Ýerinde. Ähli hukuklar goralan.
        </Typography>
      </Container>
    </Box>
  );
};

const FooterTitle = ({ text }) => (
  <Typography
    sx={{
      color: "#6EC1FF",
      mb: 2,
      fontWeight: 600,
      fontSize: 18,
    }}
  >
    {text}
  </Typography>
);

const FooterLink = ({ text }) => (
  <Link
    href="#"
    underline="none"
    sx={{
      color: "#9FB3C8",
      fontSize: 14,
      transition: "0.2s",
      "&:hover": {
        color: "#6EC1FF",
      },
    }}
  >
    {text}
  </Link>
);

export default Footer;
