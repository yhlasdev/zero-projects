import { Box, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { memo } from "react";

const getErrorMessage = (errors, name) =>
    name.split(".").reduce((acc, key) => acc?.[key], errors)?.message;

const CustomFormTextField = ({
    control,
    errors,
    name,
    label,
    required = false,
    ...rest
}) => {
    const errorMessage = getErrorMessage(errors, name);

    return (
        <Box>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        {...rest}
                        fullWidth
                        size="small"
                        label={label}
                        error={!!errorMessage}
                        helperText={errorMessage}
                        InputLabelProps={{ shrink: true }}
                    />
                )}
            />
        </Box>
    );
};

export default memo(CustomFormTextField);