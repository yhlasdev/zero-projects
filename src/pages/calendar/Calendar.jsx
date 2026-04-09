import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import DateSelect from "./components/Date";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import { useState } from "react";
import HeaderButton from "../../components/buttons/Button";
import AddIcon from "@mui/icons-material/Add";
import GlobalModal from "../../components/modal/GlobalModal";
import AddEvent from "./components/AddEvent";

import { useLocale } from "../../hooks/useLocale";
import Seo from "../../components/seo/seo";

function CalendarPage() {
  const { t } = useLocale();
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <Box>
      <Seo
        title={t("calendar.title")}
        description={t("calendar.subTitle")}
        name="Yerinde"
        type="website"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 2,
        }}
      >
        <PageTitle
          title={t("calendar.title")}
          subTitle={t("calendar.subTitle")}
        />

        <HeaderButton onClick={() => setOpenAddModal(true)} icon={<AddIcon />}>
          {t("calendar.addEvent")}
        </HeaderButton>
      </Box>
      <DateSelect />
      <GlobalModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        width={708}
      >
        <AddEvent onClose={() => setOpenAddModal(false)} />
      </GlobalModal>
    </Box>
  );
}

export default CalendarPage;
