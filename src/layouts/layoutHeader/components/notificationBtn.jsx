import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Popover, Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocale } from '../../../hooks/useLocale';

dayjs.extend(relativeTime);
    
export const NotificationBtn = () => {
    const { t, currentLanguage } = useLocale();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = () => {
        const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
        const sorted = stored.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
        setNotifications(sorted);
    };

    useEffect(() => {
        loadNotifications();

        const handleStorage = (e) => {
            if (e.key === "notifications") {
                loadNotifications();
            }
        };
        window.addEventListener('storage', handleStorage);

        const handleLocalUpdate = () => loadNotifications();
        window.addEventListener('notifications-updated', handleLocalUpdate);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('notifications-updated', handleLocalUpdate);
        };
    }, []);

    const handleClick = (event) => {
        loadNotifications();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllRead = () => {
        const updated = notifications.map(n => ({ ...n, unread: false }));
        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifications(updated);
        window.dispatchEvent(new Event('notifications-updated'));
    };

    const handleDelete = (id, e) => {
        e.stopPropagation(); // Prevent opening/clicking the item
        const updated = notifications.filter(n => n.id !== id);
        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifications(updated);
        window.dispatchEvent(new Event('notifications-updated'));
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <>
            <IconButton onClick={handleClick}>
                <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 480,
                        borderRadius: '16px',
                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                        mt: 1.5,
                        overflow: 'hidden'
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {t("notifications.title")} ({notifications.length})
                    </Typography>
                    <Button
                        size="small"
                        onClick={handleMarkAllRead}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#1976d2',
                            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        {t("notifications.markAllRead")}
                    </Button>
                </Box>

                <Divider sx={{ opacity: 0.6 }} />

                <List
                    sx={{
                        p: 0,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#ccc',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#999',
                        },
                    }}
                >
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {t("notifications.noNotifications")}
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={(e) => handleDelete(notification.id, e)} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    }
                                    sx={{
                                        py: 2,
                                        px: 2,
                                        backgroundColor: notification.unread ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <Box sx={{ mr: 2, mt: 1, display: 'flex', alignItems: 'center' }}>
                                        {notification.unread ? (
                                            <CircleIcon sx={{ fontSize: 10, color: '#1976d2' }} />
                                        ) : (
                                            <Box sx={{ width: 10 }} />
                                        )}
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondaryTypographyProps={{ component: 'div' }}
                                        secondary={
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ color: '#64748b', mt: 0.5, display: 'block' }}
                                                >
                                                    {notification.body || notification.description}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    sx={{ color: '#94a3b8', mt: 1.5, display: 'block' }}
                                                >
                                                    {dayjs(notification.date_time).locale(currentLanguage).fromNow()}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider component="li" sx={{ opacity: 0.4 }} />}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Popover>
        </>
    );
};
