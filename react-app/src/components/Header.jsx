import { useLocation, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Badge,
} from "@mui/material";

import {
    Menu as MenuIcon,
    ArrowBack as BackIcon,
    Add as AddIcon,
    Search as SearchIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Notifications as NotificationsIcon,
} from "@mui/icons-material";

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

export default function Header() {
    const { 
        auth, 
        showForm, 
        setShowForm, 
        mode, 
        setMode, 
        setShowDrawer,
        notifications: realtimeNotifications 
    } = useApp();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch notifications and calculate unread count
    const { data: fetchedNotifications = [] } = useQuery(
        "notifications",
        fetchNotifications,
        {
            enabled: !!auth, // Only fetch if user is authenticated
            refetchInterval: 30000, // Refetch every 30 seconds
        }
    );

    // Combine fetched and realtime notifications, removing duplicates
    const allNotifications = [...realtimeNotifications, ...fetchedNotifications]
        .reduce((unique, notification) => {
            const exists = unique.find(n => n.id === notification.id);
            if (!exists) {
                unique.push(notification);
            }
            return unique;
        }, [])
        .sort((a, b) => new Date(b.created) - new Date(a.created));

    const unreadCount = allNotifications.filter((n) => !n.read).length;

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {pathname === "/" ? (
                        <IconButton
                            color="inherit"
                            onClick={() => setShowDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate(-1)}
                        >
                            <BackIcon />
                        </IconButton>
                    )}
                    <Typography>App</Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <AddIcon />
                        </IconButton>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => navigate("/search")}
                    >
                        <SearchIcon />
                    </IconButton>

                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/notifications")}
                        >
                            <Badge 
                                badgeContent={unreadCount} 
                                color="error"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                    >
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}