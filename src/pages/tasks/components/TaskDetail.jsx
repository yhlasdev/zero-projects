import { Box, Typography, InputBase, Paper } from "@mui/material";
import ListIcon from "@mui/icons-material/FormatListBulleted";
import BoardIcon from "@mui/icons-material/ViewKanban";
import WeekIcon from "@mui/icons-material/ViewWeek";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

import ListView from "./ListView";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";

const VIEWS = [
  {
    label: "List",
    icon: <ListIcon sx={{ fontSize: 15 }} />,
    component: ListView,
  },
  {
    label: "Board",
    icon: <BoardIcon sx={{ fontSize: 15 }} />,
    component: BoardView,
  },
  {
    label: "Calendar",
    icon: <CalendarTodayIcon sx={{ fontSize: 15 }} />,
    component: CalendarView,
  },
];

const TaskDetailView = ({ tasks = [] }) => {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveView = VIEWS[activeTab].component;

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        // height: "calc(100vh - 208px)",
        // overflowY: 'auto'
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          px: 2,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "stretch" }}>
          {VIEWS.map((v, i) => {
            const isActive = activeTab === i;
            const isLast = i === VIEWS.length - 1;

            return (
              <Box
                key={v.label}
                sx={{ display: "flex", alignItems: "stretch" }}
              >
                <Box
                  onClick={() => setActiveTab(i)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.5,
                    py: 1,
                    cursor: "pointer",
                    position: "relative",
                    color: isActive ? "#1f4791" : "",
                    fontWeight: isActive ? 700 : 400,
                    "&::after": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          bgcolor: "#1a2b4a",
                          borderRadius: "2px 2px 0 0",
                        }
                      : {},
                    "&:hover": { color: "#1a2b4a" },
                    transition: "color 0.15s",
                  }}
                >
                  <Box
                    sx={{
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {v.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "inherit",
                      color: "inherit",
                    }}
                  >
                    {v.label}
                  </Typography>
                </Box>

                {!isLast && (
                  <Box
                    sx={{
                      width: "1px",
                      bgcolor: "#e5e7eb",
                      my: "8px",
                      mx: 0.5,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              border: "1px solid #e0e0e0",
              borderRadius: 1.5,
              cursor: "pointer",
              "&:hover": { bgcolor: "grey.50" },
            }}
          >
            <FilterListIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
              Filter
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.4,
              border: "1px solid #e0e0e0",
              borderRadius: 1.5,
              width: 140,
            }}
          >
            <SearchIcon
              sx={{ fontSize: 15, color: "text.secondary", mr: 0.5 }}
            />
            <InputBase
              placeholder="Search..."
              sx={{ fontSize: "13px", flex: 1 }}
              inputProps={{ style: { padding: 0 } }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Content ── */}
      <Box sx={{ p: 2.5 }}>
        <ActiveView tasks={tasks} />
      </Box>
    </Paper>
  );
};

export default TaskDetailView;
