import { useState } from "react";
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useForm } from "react-hook-form";

import { useValidSchema } from "../../../hooks/useValidShema";
import { SubmitButton } from "../../../components/submitButton";
import { CustomForm } from "../../../components/customForm";
import CustomFormTextField from "../../../components/customFormTextField";
import { registerEmail, registerPhone } from "../../../api/queries/post";
import { OtpSection } from "./otpSection";

export const RightSide = () => {
    const [type, setType] = useState("phone");
    const [token, setToken] = useState();
    const [otpSection, setOtpSection] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            company_name: "",
            phone_number: "",
            country_code: "993",
            password: "",
            email: "",
            fcm_token: "sdfhsdDJdfjf.sdhfjksdfsdfsdfhsdkjhfkdhJKHKJHDkjhfjkdhfjhdfjkhdjfk.dfdfhdg",
            confirm_password: "",
            type: "phone",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data) => {
        if (data.password !== data.confirm_password) {
            return;
        }
        if (type === 'phone') {

            const postData = {
                company_name: data.company_name,
                phone_number: Number(data.phone_number),
                country_code: Number(data.country_code),
                password: data.password,
                fcm_token: data.fcm_token,
            };
            try {
                const token = await registerPhone(postData);
                if (token.status == 200 || token.status == 201) {
                    setOtpSection(true);
                    setToken(token.data.data.token);
                }
            } catch (error) {
            }

        }
        if (type !== 'phone') {
            const postData = {
                company_name: data.company_name,
                email: data.email,
                password: data.password,
                fcm_token: data.fcm_token,
            };
            try {
                const token = await registerEmail(postData);
                if (token.status == 200 || token.status == 201) {
                    setOtpSection(true)
                    setToken(token.data.data.token)
                }
            } catch (error) {
            }
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 420,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <Typography variant="h1" fontWeight={600} mb={1}>
                Create an account
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={4}>
                Join now to streamline your experience from day one
            </Typography>

            {
                otpSection ? <OtpSection setOtpSection={setOtpSection} token={token} type={type} /> :

                    <Box>

                        <ToggleButtonGroup
                            value={type}
                            exclusive
                            onChange={(e, val) => {
                                if (val) {
                                    setType(val);
                                    setValue("type", val);
                                }
                            }}
                            fullWidth
                            sx={{
                                mb: 3,
                                backgroundColor: "#f2f2f2",
                                borderRadius: "30px",
                                p: 0.5,
                            }}
                        >
                            <ToggleButton value="phone">Phone number</ToggleButton>
                            <ToggleButton value="email">E-mail</ToggleButton>
                        </ToggleButtonGroup>

                        <CustomForm handleSubmit={handleSubmit(onSubmit)}>
                            <Box className="flex flex-col gap-3">

                                {/* Company Name */}
                                <CustomFormTextField
                                    control={control}
                                    errors={errors}
                                    name="company_name"
                                    label="Company name"
                                    required
                                />

                                {/* Phone / Email */}
                                {type === "phone" ? (
                                    <CustomFormTextField
                                        control={control}
                                        errors={errors}
                                        name="phone_number"
                                        label="Phone number"
                                        required
                                    />
                                ) : (
                                    <CustomFormTextField
                                        control={control}
                                        errors={errors}
                                        name="email"
                                        label="Email"
                                        required
                                    />
                                )}

                                {/* Password */}
                                <CustomFormTextField
                                    control={control}
                                    errors={errors}
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                />

                                {/* Confirm Password */}
                                <CustomFormTextField
                                    control={control}
                                    errors={errors}
                                    name="confirm_password"
                                    label="Confirm Password"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                            >
                                                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                />

                                <SubmitButton text="Register" />
                            </Box>
                        </CustomForm>
                    </Box>
            }
            <Typography variant="body2" align="center" mt={3} color="text.secondary">
                Already have an account?{" "}
                <Box
                    component="span"
                    sx={{ color: "#1A4D7A", cursor: "pointer", fontWeight: 500 }}
                >
                    Sign in
                </Box>
            </Typography>
        </Box>
    );
};