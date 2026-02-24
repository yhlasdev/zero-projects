import { createBrowserRouter, Navigate } from "react-router-dom";
import PageWrapperNoAuth from "./PageWrapperNoAuth";
import { NotFoundPage } from "../pages/others/notfound";

import PageWrapper from "./PageWrapper";
import { DashBoardPage } from "../pages/dashboard/Dashboard";
import NotificationsPage from "../pages/notifications/Notifications";
import NewRequestsPage from "../pages/newRequests/NewRequests";
import EmployeesPage from "../pages/employees/Employees";
import AttendancePage from "../pages/attendance/Attendance";
import TasksPage from "../pages/tasks/Tasks";
import LeaveRequestsPage from "../pages/leaveRequests/LeaveRequests";
import LetterRequestsPage from "../pages/letterRequests/LetterRequests";
import AnnouncementsPage from "../pages/announcements/Announcements";
import DocumentsPage from "../pages/documents/Documents";
import CalendarPage from "../pages/calendar/Calendar";
import SettingsPage from "../pages/settings/Settings";
import Welcome from "../pages/welcome/welcome";

const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <PageWrapperNoAuth>
          <Welcome />
        </PageWrapperNoAuth>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PageWrapper>
          <DashBoardPage />
        </PageWrapper>
      ),
    },
    {
      path: "/employees",
      element: (
        <PageWrapper>
          <EmployeesPage />
        </PageWrapper>
      ),
    },
    {
      path: "/attendance",
      element: (
        <PageWrapper>
          <AttendancePage />
        </PageWrapper>
      ),
    },
    {
      path: "/tasks",
      element: (
        <PageWrapper>
          <TasksPage />
        </PageWrapper>
      ),
    },
    {
      path: "/leaveRequests",
      element: (
        <PageWrapper>
          <LeaveRequestsPage />
        </PageWrapper>
      ),
    },
    {
      path: "/newRequests",
      element: (
        <PageWrapper>
          <NewRequestsPage />
        </PageWrapper>
      ),
    },
    {
      path: "/letterRequests",
      element: (
        <PageWrapper>
          <LetterRequestsPage />
        </PageWrapper>
      ),
    },
    {
      path: "/announcements",
      element: (
        <PageWrapper>
          <AnnouncementsPage />
        </PageWrapper>
      ),
    },
    {
      path: "/documents",
      element: (
        <PageWrapper>
          <DocumentsPage />
        </PageWrapper>
      ),
    },
    {
      path: "/calendar",
      element: (
        <PageWrapper>
          <CalendarPage />
        </PageWrapper>
      ),
    },
    {
      path: "/settings",
      element: (
        <PageWrapper>
          <SettingsPage />
        </PageWrapper>
      ),
    },
    {
      path: "/notifications",
      element: (
        <PageWrapper>
          <NotificationsPage />
        </PageWrapper>
      ),
    },
    {
      path: "*",
      element: (
        <PageWrapperNoAuth>
          {" "}
          <NotFoundPage />
        </PageWrapperNoAuth>
      ),
    },
  ],
  {
    basename: "/",
  },
);

export default routes;
