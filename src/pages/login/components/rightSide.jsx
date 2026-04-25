import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import FieldLabelPasswordInput from "../../../components/textField/passwordTextField";
import FieldLabel from "../../../components/textField/LabelInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocale } from "../../../hooks/useLocale";
import { EyeClosedIcon, EyeOpenIcon } from "../../../utils/Icon";

import { useEffect } from 'react';
import { messaging } from "../../../firebase";
import { getToken, onMessage } from "firebase/messaging";


const loginPhone = async ({ phone, password, fcm_token }) => {
  const phoneNumber = "993" + phone;
  const response = await axios.post(
    "http://194.156.117.223:8007/yerinde/company-service/companies/login-phone",
    { phone_number: phoneNumber, password, fcm_token },
  );
  return response.data;
};

const loginEmail = async ({ email, password, fcm_token }) => {
  const response = await axios.post(
    "http://194.156.117.223:8007/yerinde/company-service/companies/login-mail",
    { mail: email, password, fcm_token },
  );
  return response.data;
};

const validatePhone = (phone) => {
  if (!phone.trim()) return "Phone number is required.";
  if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, "")))
    return "Please enter a valid phone number.";
  return "";
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
};

const getFriendlyError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 401) return "Incorrect credentials. Please try again.";
  if (status === 404) return "Account not found. Please check your details.";
  if (status === 429)
    return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "Server error. Please try again later.";
  if (message) return message;
  if (!error?.response) return "Network error. Please check your connection.";
  return "Login failed. Please try again.";
};

export const RightSide = () => {

  const { t } = useLocale();
  const [type, setType] = useState(
    localStorage.getItem("remembered_email") ? "email" : "phone",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    !!(
      localStorage.getItem("remembered_phone") ||
      localStorage.getItem("remembered_email")
    ),
  );
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: localStorage.getItem("remembered_phone") || "",
    email: localStorage.getItem("remembered_email") || "",
    password: "",
    fcm_token: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    password: "",
    fcm_token: ""
  });

  useEffect(() => {
    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BGyWSkI71mFNdVNUlI0qP8x2GpAy17_Tu8aO20nas4C9OcL0SZZ20FwCkTL_UxMCExiUEKZB13RKkBPMlBedSnM",
        });

        if (token) {
          setForm((prev) => ({ ...prev, fcm_token: token }));
        } else {
          console.log("no token available");
        }
      }
    });

    const unsubscribe = onMessage(messaging, (payload) => {
      toast.info(payload.notification?.title || "new notification");
    });

    return () => unsubscribe();
    /*     onMessage(messaging, (payload) => {
          console.log(payload);
        }); */
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = {
      phone: type === "phone" ? validatePhone(form.phone) : "",
      email: type === "email" ? validateEmail(form.email) : "",
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (type === "phone") {
        return loginPhone({ phone: form.phone, password: form.password, fcm_token: form.fcm_token });
      } else {
        return loginEmail({ email: form.email, password: form.password, fcm_token: form.fcm_token });
      }
    },
    onSuccess: (data) => {
      const token = data.data?.token;
      if (token) {
        if (rememberMe) {
          if (type === "phone") {
            localStorage.setItem("remembered_phone", form.phone);
            localStorage.removeItem("remembered_email");
          } else {
            localStorage.setItem("remembered_email", form.email);
            localStorage.removeItem("remembered_phone");
          }
        } else {
          localStorage.removeItem("remembered_phone");
          localStorage.removeItem("remembered_email");
        }

        Cookies.set("auth_token", token, {
          expires: 30,
          secure: false,
          sameSite: "Lax",
        });
        navigate("/dashboard");
        toast.success(t("login.loginSuccess"));
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

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
        {t("login.welcome")}
      </Typography>

      <Typography
        fontSize={15}
        fontWeight={400}
        color="#9F9F9F"
        textAlign="center"
        mb={4}
      >
        {t("login.subtitle")}
      </Typography>

      {/* Toggle */}
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(e, val) => {
          if (val) {
            setType(val);
            setErrors({ phone: "", email: "", password: "" });
            mutation.reset();
          }
        }}
        fullWidth
        sx={{
          mb: 3,
          borderRadius: "30px",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "#F3F4F6",
          p: 0.5,
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "30px !important",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            color: "#4e4e4eff",
            transition: "all 0.2s",
            "&.Mui-selected": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "#FFFFFF",
              color: "#4e4e4eff",
            },
            // ".css-1ov0pa-MuiToggleButtonGroup-root .MuiToggleButton-root.Mui-selected": {
            //   color: "#eeeeee",
            // }
          },
        }}
      >
        <ToggleButton value="phone">{t("common.phone")}</ToggleButton>
        <ToggleButton value="email">{t("common.email")}</ToggleButton>
      </ToggleButtonGroup>

      {/* API error */}
      {mutation.isError && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: "10px", fontSize: 13 }}
        >
          {getFriendlyError(mutation.error)}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        {type === "phone" ? (
          <FieldLabel
            label={t("common.phone")}
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            width={420}
            height={46}
            startIcon={'+993'}
          />
        ) : (
          <FieldLabel
            type="email"
            label={t("common.email")}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            height={46}
          />
        )}

        <FieldLabelPasswordInput
          label={t("common.password")}
          pasType={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          height={46}
          icon={
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </IconButton>
          }
        />

        {/* Remember me + Forgot password */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 0.5,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                sx={{
                  color: "primary.main",
                  "&.Mui-checked": { color: "primary.main" },
                }}
              />
            }
            label={
              <Typography fontSize={13} color="#374151">
                {t("login.rememberMe")}
              </Typography>
            }
          />

          <Typography
            component="a"
            href="/forgot-password"
            fontSize={13}
            fontWeight={500}
            color="#0F3254"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {t("login.forgot")}
          </Typography>
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={mutation.isLoading}
          sx={{
            mt: 2,
            py: 1.6,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: 15,
            fontWeight: 700,
            height: "48px",
            backgroundColor: "primary.main",
            boxShadow: "none",
            "&:hover": { backgroundColor: "primary.dark", boxShadow: "none" },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          {mutation.isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            t("login.submit")
          )}
        </Button>

        {/* Register link */}
        <Typography fontSize={13} color="#9F9F9F" textAlign="center" mt={1}>
          {t("login.noAccount")}
          <Typography
            component="a"
            href="/register"
            fontSize={13}
            fontWeight={600}
            color="#0F3254"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {t("login.register")}
          </Typography>
        </Typography>
      </form>
    </Box>
  );
};
