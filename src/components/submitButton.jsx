import { Button } from "@mui/material"

export const SubmitButton = ({ text, loading }) => {
    return (
        <Button
            type="submit"
            loading={loading}
            disabled={loading}
            variant="contained"
            size="large">
            {text}
        </Button >
    )
}