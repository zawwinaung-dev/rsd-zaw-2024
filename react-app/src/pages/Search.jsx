import { useState } from "react";
import { useQuery } from "react-query";
import {
    Container,
    Box,
    TextField,
    CircularProgress,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Stack,
} from "@mui/material";
import { Link } from "react-router";
import { fetchWithAuth } from "../utils/api";
import FollowButton from "../components/FollowButton";
import { useApp } from "../AppProvider";

export default function Search() {
    const [query, setQuery] = useState("");
    const { auth } = useApp();

    const { data: users, isLoading } = useQuery(
        ["search", query],
        () => fetchWithAuth(`/search?q=${encodeURIComponent(query)}`),
        {
            enabled: query.length > 0,
        }
    );

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    label="Search users"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Box>

            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {users?.length === 0 && (
                <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", mt: 4 }}>
                    No users found
                </Typography>
            )}

            {users && users.length > 0 && (
                <List>
                    {users.map((user) => (
                        <ListItem
                            key={user.id}
                            component={Link}
                            to={`/users/${user.id}`}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                                textDecoration: "none",
                                color: "inherit",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}>
                            <ListItemAvatar>
                                <Avatar>{user.name[0]}</Avatar>
                            </ListItemAvatar>
                            <Box sx={{ flex: 1 }}>
                                <ListItemText
                                    primary={user.name}
                                    secondary={`@${user.username}`}
                                />
                                {user.bio && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}>
                                        {user.bio}
                                    </Typography>
                                )}
                            </Box>
                            {auth && (
                                <Box sx={{ ml: 2 }}>
                                    <FollowButton
                                        userId={user.id}
                                        isFollowing={user.isFollowing}
                                    />
                                </Box>
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
}