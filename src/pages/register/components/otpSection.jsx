import { Box, Button, Typography } from "@mui/material"
import { CustomForm } from "../../../components/customForm";
import { SubmitButton } from "../../../components/submitButton";
import { Controller, useForm } from "react-hook-form";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useLoading } from "../../../hooks/useLoading";
import { registerVerify } from "../../../api/queries/post";
import { useNavigate } from "react-router-dom";

export const OtpSection = ({ setOtpSection, token, type }) => {

    const { isLoading, onLoading, stopLoading } = useLoading()

    const navigate = useNavigate()

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (data) => {
        onLoading()
        try {
            const res = await registerVerify({ "code": data.code }, token, type == 'phone' ? 'company-service/sms/verify' : 'company-service/mail/verify');
            if (res.status == 200 || res.status == 201) {
                Cookies.set('auth_token', res.data.data.token);
                navigate('/dashboard');
            }

        } catch (error) {
            throw new Error(error)
        } finally {
            stopLoading()
        }
    };
    return (
        <Box className='otp-section'>
            <Button onClick={() => setOtpSection(false)}> back </Button>
            <CustomForm handleSubmit={handleSubmit(onSubmit)} >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
                    <Typography variant="h6">Telefonyňyza ugradylan tassyklaýyş kodyny giriň</Typography>

                    <Controller
                        name="code"
                        control={control}
                        rules={{
                            required: '4 sifr bolmaly',
                            minLength: { value: 4, message: '4 sifr' }
                        }}
                        render={({ field, fieldState }) => (
                            <Box>
                                <MuiOtpInput
                                    {...field}
                                    length={4}
                                    TextFieldProps={{
                                        error: !!fieldState.error,
                                        helperText: fieldState.error?.message
                                    }}
                                />
                            </Box>
                        )}
                    />

                    <SubmitButton text={'kody tassyklamak'} loading={isLoading} />
                </Box>
            </CustomForm>
        </Box>
    )
}