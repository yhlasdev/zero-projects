import React, { useState } from 'react';
import { IconButton, Badge, Popover, Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';

const mockNotifications = [
    {
        id: 1,
        title: "New leave request",
        description: "Sarah Johnson requested 5 days leave",
        time: "2 hours ago",
        unread: true
    },
    {
        id: 2,
        title: "Task completed",
        description: "Kevin Park completed blog post task",
        time: "5 hours ago",
        unread: true
    },
    {
        id: 3,
        title: "New employee request",
        description: "Alexandra Martinez applied for UX Designer",
        time: "1 day ago",
        unread: false
    }
];

export const NotificationBtn = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <IconButton onClick={handleClick}>
                <Badge color="secondary" variant="dot" invisible={false}>
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
                        Notifications
                    </Typography>
                    <Button
                        size="small"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#1976d2',
                            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        Mark all read
                    </Button>
                </Box>

                <Divider sx={{ opacity: 0.6 }} />

                <List sx={{ p: 0 }}>
                    {mockNotifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                            <ListItem
                                alignItems="flex-start"
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
                                    secondary={
                                        <Box component="span">
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#64748b', mt: 0.5, display: 'block' }}
                                            >
                                                {notification.description}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#94a3b8', mt: 1.5, display: 'block' }}
                                            >
                                                {notification.time}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < mockNotifications.length - 1 && <Divider component="li" sx={{ opacity: 0.4 }} />}
                        </React.Fragment>
                    ))}
                </List>
            </Popover>
        </>
    );
};
