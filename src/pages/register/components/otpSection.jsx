import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { registerVerify } from "../../../api/queries/post";

const getFriendlyError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 400) return "Invalid or expired code. Please try again.";
  if (status === 401) return "Verification failed. Please request a new code.";
  if (status === 429) return "Too many attempts. Please wait a moment.";
  if (status >= 500) return "Server error. Please try again later.";
  if (message) return message;
  if (!error?.response) return "Network error. Please check your connection.";
  return "Verification failed. Please try again.";
};

const NAVY = "#0F3254";

export const OtpSection = ({ setOtpSection, token, type }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const endpoint =
    type === "phone"
      ? "company-service/sms/verify"
      : "company-service/mail/verify";

  const handleChange = (val) => {
    setCode(val);
    setError("");
  };

  const handleSubmit = async () => {
    if (code.length < 4) {
      setError("Please enter the 4-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await registerVerify({ code }, token, endpoint);
      if (res.status === 200 || res.status === 201 || res.status == 202) {
        Cookies.set("auth_token", res.data.data.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        gap: 3,
        width: "30%",
        mx: "auto",
      }}
    >
      {/* Back button */}
      <Button
        onClick={() => setOtpSection(false)}
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{
          alignSelf: "flex-start",
          color: NAVY,
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
          p: 1,
          "&:hover": { background: "none", opacity: 0.7 },
        }}
        disableRipple
      >
        Back
      </Button>

      {/* Title */}
      <Box>
        <Typography fontSize={28} fontWeight={700} color={NAVY} mb={1}>
          Verify your {type === "phone" ? "phone number" : "email"}
        </Typography>
        <Typography fontSize={14} color="#9F9F9F">
          {type === "phone"
            ? "Enter the 4-digit code sent to your phone."
            : "Enter the 4-digit code sent to your email."}
        </Typography>
      </Box>

      {/* API / validation error */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: "10px", fontSize: 13 }}>
          {error}
        </Alert>
      )}

      {/* OTP Input */}
      <MuiOtpInput
        value={code}
        onChange={handleChange}
        length={4}
        autoFocus
        TextFieldProps={{
          error: !!error,
          sx: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "&.Mui-focused fieldset": { borderColor: NAVY },
            },
          },
        }}
        sx={{ gap: 2 }}
      />

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        disabled={loading || code.length < 4}
        sx={{
          mt: 1,
          py: 1.6,
          borderRadius: "10px",
          textTransform: "none",
          fontSize: 15,
          fontWeight: 700,
          backgroundColor: NAVY,
          boxShadow: "none",
          "&:hover": { backgroundColor: "#0a2540", boxShadow: "none" },
          "&:active": { transform: "scale(0.98)" },
          "&.Mui-disabled": { backgroundColor: "#c8d5e0", color: "#fff" },
        }}
      >
        {loading ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          "Verify code"
        )}
      </Button>
    </Box>
  );
};
