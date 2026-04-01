import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { registerEmail, registerPhone } from "../../../api/queries/post";
import { OtpSection } from "./otpSection";
import FieldLabel from "../../../components/textField/LabelInput";
import FieldLabelPasswordInput from "../../../components/textField/passwordTextField";
import { useLocale } from "../../../hooks/useLocale";
import { EyeClosedIcon, EyeOpenIcon } from "../../../utils/Icon";

const validateCompanyName = (v) => {
  if (!v.trim()) return "Company name is required.";
  if (v.trim().length < 2) return "Company name must be at least 2 characters.";
  return "";
};

const validatePhone = (v) => {
  if (!v.trim()) return "Phone number is required.";
  if (!/^\+?[0-9]{7,15}$/.test(v.replace(/\s/g, "")))
    return "Please enter a valid phone number.";
  return "";
};

const validateEmail = (v) => {
  if (!v.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return "Please enter a valid email address.";
  return "";
};

const validatePassword = (v) => {
  if (!v) return "Password is required.";
  if (v.length < 6) return "Password must be at least 6 characters.";
  return "";
};

const validateConfirmPassword = (v, password) => {
  if (!v) return "Please confirm your password.";
  if (v !== password) return "Passwords do not match.";
  return "";
};

const getFriendlyError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 409) return "An account with this information already exists.";
  if (status === 422) return "Please check your information and try again.";
  if (status === 429)
    return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "Server error. Please try again later.";
  if (message) return message;
  if (!error?.response) return "Network error. Please check your connection.";
  return "Registration failed. Please try again.";
};

export const RightSide = () => {
  const { t } = useLocale();
  const [type, setType] = useState("phone");
  const [token, setToken] = useState(null);
  const [otpSection, setOtpSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const FCM_TOKEN =
    "sdfhsdDJdfjf.sdhfjksdfsdfsdfhsdkjhfkdhJKHKJHDkjhfjkdhfjhdfjkhdjfk.dfdfhdg";

  const [form, setForm] = useState({
    company_name: "",
    phone_number: "",
    country_code: "993",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    company_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {
      company_name: validateCompanyName(form.company_name),
      phone_number: type === "phone" ? validatePhone(form.phone_number) : "",
      email: type === "email" ? validateEmail(form.email) : "",
      password: validatePassword(form.password),
      confirm_password: validateConfirmPassword(
        form.confirm_password,
        form.password,
      ),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    try {
      let response;
      if (type === "phone") {
        const res = {
          company_name: form.company_name,
          country_code: Number(form.country_code),
          phone_number: Number(form.phone_number),
          password: form.password,
          fcm_token: FCM_TOKEN,
        }
        console.log('this----', res);
        response = await registerPhone(res);
      } else {
        response = await registerEmail({
          company_name: form.company_name,
          email: form.email,
          password: form.password,
          fcm_token: FCM_TOKEN,
        });
      }

      if (response.status === 200 || response.status === 201) {
        setToken(response.data.data.token);
        setOtpSection(true);
      }
    } catch (error) {
      setApiError(getFriendlyError(error));
    } finally {
      setLoading(false);
    }
  };

  const NAVY = "#0F3254";

  if (otpSection) {
    return (
      <OtpSection setOtpSection={setOtpSection} token={token} type={type} />
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 460,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: 2,
      }}
    >
      {/* Heading */}
      <Typography
        fontSize={42}
        color="primary.main"
        textAlign="center"
        fontWeight={700}
        mb={1}
      >
        {t('register.title')}
      </Typography>

      <Typography
        fontSize={15}
        fontWeight={400}
        color="#9F9F9F"
        textAlign="center"
        mb={4}
      >
        {t('register.subtitle')}
      </Typography>

      {/* Toggle */}
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(e, val) => {
          if (val) {
            setType(val);
            setErrors((prev) => ({ ...prev, phone_number: "", email: "" }));
            setApiError("");
          }
        }}
        fullWidth
        sx={{
          mb: 3,
          borderRadius: "30px",
          backgroundColor: "#F3F4F6",
          p: 0.5,
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "30px !important",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            color: "#9F9F9F",
            transition: "all 0.2s",
            "&.Mui-selected": {
              backgroundColor: "#FFFFFF",
              color: "#9F9F9F",
              "&:hover": { backgroundColor: "#FFFFFF" },
            },
          },
        }}
      >
        <ToggleButton value="phone">{t('common.phone')}</ToggleButton>
        <ToggleButton value="email">{t('common.email')}</ToggleButton>
      </ToggleButtonGroup>

      {apiError && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: "10px", fontSize: 13 }}
        >
          {apiError}
        </Alert>
      )}

      <Box className="flex flex-col gap-3">
        <FieldLabel
          label={t('settings.companyName')}
          value={form.company_name}
          height={46}
          onChange={(e) => handleChange("company_name", e.target.value)}
          error={!!errors.company_name}
          helperText={errors.company_name}
        />

        {type === "phone" ? (
          <FieldLabel
            label={t('common.phone')}
            value={form.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
            height={46}
            startIcon={'+993'}
          />
        ) : (
          <FieldLabel
            type="email"
            label={t('common.email')}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            height={46}
          />
        )}

        <FieldLabelPasswordInput
          label={t('common.password')}
          pasType={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          icon={
            <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </IconButton>
          }
        />

        {/* Confirm Password */}
        <FieldLabelPasswordInput
          label={t('common.confirmPassword')}
          pasType={showPasswordConfirm ? "text" : "password"}
          value={form.confirm_password}
          onChange={(e) => handleChange("confirm_password", e.target.value)}
          error={!!errors.confirm_password}
          helperText={errors.confirm_password}
          icon={
            <IconButton
              onClick={() => setShowPasswordConfirm((p) => !p)}
              edge="end"
            >
              {showPasswordConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </IconButton>
          }
        />

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.6,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: 15,
            fontWeight: 700,
            backgroundColor: NAVY,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#0a2540", boxShadow: "none" },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            t('register.submit')
          )}
        </Button>
      </Box>

      {/* Sign in link */}
      <Typography fontSize={13} color="#9F9F9F" textAlign="center" mt={2}>
        {t('register.haveAccount')}{" "}
        <Button
          onClick={() => navigate("/login")}
          sx={{
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            color: "primary.main",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
            },
          }}
        >
          {t('register.signIn')}
        </Button>
      </Typography>
    </Box>
  );
};
