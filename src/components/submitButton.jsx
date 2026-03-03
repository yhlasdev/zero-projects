import { Button } from "@mui/material"

export const SubmitButton = ({ text, disabled, loading }) => {
    return (
        <Button
            type="submit"
            loading={loading}
            disabled={disabled}
            variant="contained"
            size="large">
            {text}
        </Button >
    )
}