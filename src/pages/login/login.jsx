import { Box } from "@mui/material";
import { LeftSide } from "./components/leftSide";
import { RightSide } from "./components/rightSide";
import { useLocale } from "../../hooks/useLocale";
import Seo from "../../components/seo/seo";

const LoginPage = () => {
    const { t } = useLocale();

    return (
        <Box
            className="flex p-2 items-center h-screen mx-auto"
            sx={{ maxWidth: "1500px" }}
        >
            <Seo
                title={t("login.welcome")}
                description={t("login.subtitle")}
                name="Yerinde"
                type="website"
            />
      <LeftSide />
      <RightSide />
    </Box>
  );
};

export default LoginPage;
