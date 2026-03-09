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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import FieldLabelPasswordInput from "../../../components/textField/passwordTextField";
import FieldLabel from "../../../components/textField/LabelInput";
import { useNavigate } from "react-router-dom";

const loginPhone = async ({ phone, password }) => {
  const response = await axios.post(
    "http://194.156.117.223:8007/yerinde/company-service/companies/login-phone",
    { phone_number: phone, password },
  );
  return response.data;
};

const loginEmail = async ({ email, password }) => {
  const response = await axios.post(
    "http://194.156.117.223:8007/yerinde/company-service/companies/login-mail",
    { mail: email, password },
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
  const [type, setType] = useState("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    password: "",
  });

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
        return loginPhone({ phone: form.phone, password: form.password });
      } else {
        return loginEmail({ email: form.email, password: form.password });
      }
    },
    onSuccess: (data) => {
      const token = data.data?.token;
      if (token) {
        Cookies.set("auth_token", token, {
          expires: rememberMe ? 30 : 1,
          secure: true,
          sameSite: "Strict",
        });
        navigate("/dashboard");
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
        color="#0F3254"
        textAlign="center"
        fontWeight={700}
        mb={1}
      >
        Welcome back
      </Typography>

      <Typography
        fontSize={15}
        fontWeight={400}
        color="#9F9F9F"
        textAlign="center"
        mb={4}
      >
        Enter your credentials to access your account
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
              // "&:hover": { backgroundColor: "#0a2540" },
            },
          },
        }}
      >
        <ToggleButton value="phone">Phone number</ToggleButton>
        <ToggleButton value="email">E-mail</ToggleButton>
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
            label="Phone number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            width={420}
            height={46}
          />
        ) : (
          <FieldLabel
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            height={46}
          />
        )}

        <FieldLabelPasswordInput
          label="Password"
          pasType={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          icon={
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
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
                  color: "#0F3254",
                  "&.Mui-checked": { color: "#0F3254" },
                }}
              />
            }
            label={
              <Typography fontSize={13} color="#374151">
                Remember me
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
            Forgot your password?
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
            backgroundColor: "#0F3254",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#0a2540", boxShadow: "none" },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          {mutation.isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Log in"
          )}
        </Button>

        {/* Register link */}
        <Typography fontSize={13} color="#9F9F9F" textAlign="center" mt={1}>
          Don't have an account?
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
            Register now
          </Typography>
        </Typography>
      </form>
    </Box>
  );
};
