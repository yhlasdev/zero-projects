import { Box, Button, Grid } from "@mui/material"
import FieldLabel from "../../../components/textField/LabelInput";


const ContactInformation = () => {
  return (
    <Box>


      <Grid container spacing={2.5} mb={3}>
        <Grid size={12}>
          <FieldLabel label="Website" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Email" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Phone" />
        </Grid>
        <Grid size={12}>
          <FieldLabel label="Address" maxRows={3} />
        </Grid>
        <Grid size={12}>
          Social  media links
        </Grid>
        <Grid size={4}>
          <FieldLabel label="Linkedn" />
        </Grid>
        <Grid size={4}>
          <FieldLabel label="Twitter" />
        </Grid>
        <Grid size={4}>
          <FieldLabel label="Facebook" />
        </Grid>
        <Grid size={4}>
          <FieldLabel label="Tiktok" />
        </Grid>
        <Grid size={4}>
          <FieldLabel label="Instagram" />
        </Grid>
        <Grid size={4}>
          <FieldLabel label="Whatsapp" />
        </Grid>
      </Grid>


      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="medium"
          // startIcon={<SaveIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            px: 3,
            fontWeight: 600,
            bgcolor: "#1a2b4a",
            "&:hover": { bgcolor: "#243560" },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  )
}

export default ContactInformation;