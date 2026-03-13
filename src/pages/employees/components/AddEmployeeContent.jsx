import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FieldLabel from "../../../components/textField/LabelInput";
import { useLocale } from "../../../hooks/useLocale";

export default function AddEmployeeContent({ onClose }) {
  const { t } = useLocale();
  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>{t('employees.addEmployee')}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box p={3}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ height: 200 }}>
              <Typography fontSize={14} mb={1}>
                {t('employees.uploadPhoto')}
              </Typography>

              <Box
                sx={{
                  border: "2px dashed #d0d0d0",
                  borderRadius: 2,
                  height: 150,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#777",
                  cursor: "pointer",
                }}
              >
                <CloudUploadOutlinedIcon fontSize="large" />
                <Typography fontSize={13}>
                  {t('employees.uploadHint')}
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  {t('employees.fileInfo')}
                </Typography>
              </Box>
            </Box>
            <FieldLabel label={t('common.department')} />

            <FieldLabel label={t('employees.employeeId')} />

            <FieldLabel label={t('common.nationality')} />

            <FieldLabel label={t('employees.hiringDate')} />

            <FieldLabel label={t('employees.reportsTo')} />
          </Grid>

          <Grid size={6}>
            <Box sx={{ height: 200 }}>
              <Typography fontSize={14} mb={1}>
                {t('common.status')}
              </Typography>
              <RadioGroup row defaultValue="inactive">
                <FormControlLabel
                  value="active"
                  control={<Radio />}
                  label={t('common.active')}
                />
                <FormControlLabel
                  value="inactive"
                  control={<Radio />}
                  label={t('common.inactive')}
                />
              </RadioGroup>
            </Box>
            {/* Title */}
            <FieldLabel label={t('common.title')} />

            <FieldLabel label={t('employees.probationEnd')} />

            <FieldLabel label={t('employees.workingTiming')} />

            <FieldLabel label={t('employees.office')} />
          </Grid>
        </Grid>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained">{t('employees.addEmployee')}</Button>
      </Box>
    </Box>
  );
}
