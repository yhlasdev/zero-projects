import { Box } from "@mui/material";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderButton from "../../components/buttons/Button";
import AddIcon from "@mui/icons-material/Add";

import CreateTask from "./components/CreateTaskContent";
import TaskDetailView from "./components/TaskDetail";
import GlobalModal from "../../components/modal/GlobalModal";
import { useState } from "react";

const TasksPage = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box>
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
          <PageTitle title="Task" subTitle="Manage and track employee tasks" />
        </Box>

        <HeaderButton
          width={160}
          onClick={() => setOpenModal(true)}
          icon={<AddIcon />}
        >
          Create task
        </HeaderButton>
      </Box>

      <TaskDetailView />

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
