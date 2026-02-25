import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CircularProgress
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
    { phone_number: phone, password }
  );
  return response.data;
};

const loginEmail = async ({ email, password }) => {
  const response = await axios.post(
    "http://194.156.117.223:8007/yerinde/company-service/companies/login-mail",
    { mail: email, password }
  );
  return response.data;
};

export const RightSide = () => {
  const [type, setType] = useState("phone");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const [form, setForm] = useState({
    phone: "99365878660",
    email: "",
    password: "msm04112004",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // React Query mutation
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
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        console.log("Login success");
        navigate("/dashboard");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <Typography variant="h1" fontWeight={600} mb={1}>
        Welcome back
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Enter your credentials
      </Typography>

      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(e, val) => val && setType(val)}
        fullWidth
        sx={{ mb: 3, borderRadius: "30px", p: 0.5 }}
      >
        <ToggleButton value="phone">Phone number</ToggleButton>
        <ToggleButton value="email">E-mail</ToggleButton>
      </ToggleButtonGroup>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {type === "phone" ? (
          <FieldLabel
            label="Phone number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        ) : (
          <FieldLabel
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        )}

        <FieldLabelPasswordInput
          label="Password"
          pasType={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          icon={
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          }
        />

        {mutation.isError && (
          <Typography color="error">
            {mutation.error?.response?.data?.message || "Login failed"}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={mutation.isLoading}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: "10px",
            textTransform: "none",
            backgroundColor: "#1A4D7A",
          }}
        >
          {mutation.isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </Box>
  );
};