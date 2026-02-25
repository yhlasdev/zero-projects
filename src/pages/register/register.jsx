import { Box } from "@mui/material";
import { LeftSide } from "./components/leftSide";
import { RightSide } from "./components/rightSide";

const RegisterPage = () => {
    return (
        <Box className='flex p-2 items-center h-screen mx-auto' sx={{ maxWidth: '1500px' }}>

            <LeftSide />
            <RightSide />
        </Box>
    );
};

export default RegisterPage;