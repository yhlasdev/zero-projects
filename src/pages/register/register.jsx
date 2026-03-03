import { Box } from "@mui/material";
import { LeftSide } from "./components/leftSide";
import { RightSide } from "./components/rightSide";

const RegisterPage = () => {

    return (
        <Box sx={{
            minHeight: '100vh',
            paddingY: '50px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}>
            <Box
                className='flex items-center mx-auto'
                sx={{ maxWidth: '1500px', height: '100%', gap: 4 }}
            >
                <LeftSide />
                <RightSide />
            </Box>
        </Box>
    );
};

export default RegisterPage;