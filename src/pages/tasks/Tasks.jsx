import { Box } from "@mui/material";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderButton from "../../components/buttons/Button";
import AddIcon from "@mui/icons-material/Add";

import CreateTask from "./components/CreateTaskContent";
import TaskDetailView from "./components/TaskDetail";
import GlobalModal from "../../components/modal/GlobalModal";
import { useState } from "react";
import { useLocale } from "../../hooks/useLocale";
import Seo from "../../components/seo/seo";

const TasksPage = () => {
  const { t } = useLocale();
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box tabIndex={0}>
      <Seo
        title={t("tasks.title")}
        description={t("tasks.subtitle")}
        name="Yerinde"
        type="website"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          height: 60,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PageTitle title={t('tasks.title')} subTitle={t('tasks.subtitle')} />
        </Box>

        <HeaderButton
          width={160}
          onClick={() => setOpenModal(true)}
          icon={<AddIcon />}
        >
          {t('tasks.createTask')}
        </HeaderButton>
      </Box>

      <TaskDetailView onOpenCreateModal={() => setOpenModal(true)} />

      <GlobalModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateTask onClose={() => setOpenModal(false)} />
      </GlobalModal>
    </Box>
  );
};

export default TasksPage;
