import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    IconButton,
    Button,
} from "@mui/material";
import { formatDistance } from "date-fns";
import { blue } from "@mui/material/colors";

const API = "http://localhost:8080";

async function fetchNotifications() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/notifications`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
}

async function markNotificationRead(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
    return res.json();
}

async function markAllNotificationsRead() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/notifications/read`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to mark all notifications as read");
    return res.json();
}

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { auth } = useApp();

    const { data: notifications = [], isLoading } = useQuery(
        "notifications",
        fetchNotifications,
        {
            enabled: !!auth,
            refetchInterval: 30000, // Refetch every 30 seconds
        }
    );

    const markReadMutation = useMutation(markNotificationRead, {
        onSuccess: () => {
            queryClient.invalidateQueries("notifications");
        },
    });

    const markAllReadMutation = useMutation(markAllNotificationsRead, {
        onSuccess: () => {
            queryClient.invalidateQueries("notifications");
        },
    });

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markReadMutation.mutateAsync(notification.id);
        }

        // Navigate based on notification type
        switch (notification.type) {
            case "LIKE":
            case "COMMENT":
                navigate(`/posts/${notification.postId}`);
                break;
            case "FOLLOW":
                navigate(`/users/${notification.actorId}`);
                break;
            default:
                break;
        }
    };

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case "LIKE":
                return "liked your post";
            case "COMMENT":
                return "commented on your post";
            case "FOLLOW":
                return "started following you";
            default:
                return "";
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography>Loading notifications...</Typography>
            </Box>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Box>
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Notifications</Typography>
                {unreadCount > 0 && (
                    <Button
                        variant="outlined"
                        onClick={() => markAllReadMutation.mutate()}
                        disabled={markAllReadMutation.isLoading}
                    >
                        Mark All as Read
                    </Button>
                )}
            </Box>
            
            {!notifications.length ? (
                <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography>No notifications yet</Typography>
                </Box>
            ) : (
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {notifications.map((notification) => (
                        <ListItem
                            key={notification.id}
                            disablePadding
                            sx={{
                                bgcolor: notification.read ? "transparent" : "action.hover",
                            }}
                        >
                            <ListItemButton
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: blue[500],
                                            cursor: "pointer",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/users/${notification.actor.id}`);
                                        }}
                                    >
                                        {notification.actor.name[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <Typography
                                                component="span"
                                                sx={{ fontWeight: "bold" }}
                                            >
                                                {notification.actor.name}
                                            </Typography>
                                            <Typography component="span">
                                                {getNotificationText(notification)}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={formatDistance(
                                        new Date(notification.created),
                                        new Date(),
                                        { addSuffix: true }
                                    )}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}