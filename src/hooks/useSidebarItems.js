import { useLocale } from "./useLocale"

import DashboardIcon from '@mui/icons-material/Dashboard';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMemo } from "react"

export const useSidebarItems = () => {
    const { t } = useLocale();

    const sidebarItemsRoutes = useMemo(() => {
        const allItems = [
            {
                id: 'Dashboard',
                name: t('sidebar.dashboard'),
                routeKey: 'dashboard',
                icon: DashboardIcon
            },
            {
                id: 'Employees',
                name: t('sidebar.employees'),
                routeKey: 'employees',
                icon: Diversity3Icon
            },
            {
                id: 'Attendance',
                name: t('sidebar.attendance'),
                routeKey: 'attendance',
                icon: EventAvailableIcon
            },
            {
                id: 'Tasks',
                name: t('sidebar.tasks'),
                routeKey: 'tasks',
                icon: AssignmentTurnedInIcon
            },
            {
                id: 'LeaveRequests',
                name: t('sidebar.leaveRequests'),
                routeKey: 'leaveRequests',
                icon: EventIcon
            },
            {
                id: 'NewRequest',
                name: t('sidebar.newRequests'),
                routeKey: 'newRequests',
                icon: PersonAddAlt1Icon
            },
            {
                id: 'Announcements',
                name: t('sidebar.announcements'),
                routeKey: 'announcements',
                icon: CampaignIcon
            },
            {
                id: 'Documents',
                name: t('sidebar.documents'),
                routeKey: 'documents',
                icon: ArticleIcon
            },
            {
                id: 'Calendar',
                name: t('sidebar.calendar'),
                routeKey: 'calendar',
                icon: CalendarTodayIcon
            },
            {
                id: 'Settings',
                name: t('sidebar.settings'),
                routeKey: 'settings',
                icon: SettingsIcon
            },
        ]
        return allItems;
    }, [t]);

    return { sidebarItemsRoutes }

}