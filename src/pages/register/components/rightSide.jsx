import {
    Box,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FieldLabelPasswordInput from "../../../components/textField/passwordTextField";
import FieldLabel from '../../../components/textField/LabelInput'

export const RightSide = () => {
    const [type, setType] = useState("phone");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleSumbit = (e) => {
        e.preventDefault();
    }

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
                Create an account
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={4}>
                Join now to streamline your experience from day one
            </Typography>

            <ToggleButtonGroup
                value={type}
                exclusive
                onChange={(e, val) => val && setType(val)}
                fullWidth
                sx={{
                    mb: 3,
                    backgroundColor: "#f2f2f2",
                    borderRadius: "30px",
                    p: 0.5
                }}
            >
                <ToggleButton
                    value="phone"
                    sx={{
                        borderRadius: "30px !important",
                        textTransform: "none",
                        border: "none",
                        "&.Mui-selected": {
                            backgroundColor: "#fff",
                            color: "#000",
                        },
                        "&.Mui-selected:hover": {
                            backgroundColor: "#fff",
                        }
                    }}
                >
                    Phone number
                </ToggleButton>

                <ToggleButton
                    value="email"
                    sx={{
                        borderRadius: "30px !important",
                        textTransform: "none",
                        border: "none",
                        "&.Mui-selected": {
                            backgroundColor: "#fff",
                            color: "#000",
                        },
                        "&.Mui-selected:hover": {
                            backgroundColor: "#fff",
                        }
                    }}
                >
                    E-mail
                </ToggleButton>
            </ToggleButtonGroup>

            <form onSubmit={handleSumbit} className=" flex flex-col gap-3">

                <FieldLabel
                    label={'Company name'} />

                {
                    type === 'phone' ?
                        <FieldLabel
                            label={'Phone number'} /> :
                        <FieldLabel
                            type='email'
                            label={'Email'} />
                }

                <FieldLabelPasswordInput
                    label={'Password'}
                    pasType={showPassword ? 'text' : 'password'}
                    icon={<IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>} />


                <FieldLabelPasswordInput
                    label={'Confirm Password'}
                    pasType={showPasswordConfirm ? 'text' : 'password'}
                    icon={<IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                        {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>} />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: "10px",
                        textTransform: "none",
                        backgroundColor: "#1A4D7A",
                        "&:hover": {
                            backgroundColor: "#163E63"
                        }
                    }}
                >
                    Log in
                </Button>
            </form>

            <Typography
                variant="body2"
                align="center"
                mt={3}
                color="text.secondary"
            >
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