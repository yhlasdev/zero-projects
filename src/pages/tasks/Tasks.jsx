import { Box } from "@mui/material";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import HeaderButton from "../../components/buttons/Button";
import AddIcon from "@mui/icons-material/Add";

import Header from "./components/Header";
import TaskTable from "./components/TaskTable";
import CreateTask from "./components/CreateTaskContent";
import { useState } from "react";
import GlobalModal from "../../components/modal/GlobalModal";

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
        }}
      >
        <PageTitle title="Task" subTitle="Manage and track employee tasks" />
        <HeaderButton onClick={() => setOpenModal(true)} icon={<AddIcon />}>
          Create task
        </HeaderButton>
      </Box>
      <Header />
      <TaskTable />

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
