import { useState } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "react-query";

const API = "http://localhost:8080";

const searchUsers = async (query) => {
    if (!query) return [];
    const res = await fetch(`${API}/search?q=${query}`);
    if (!res.ok) throw new Error("Failed to search users");
    return res.json();
};

export default function Search() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [searchTerm, setSearchTerm] = useState(query);

    const { data: users = [], isLoading } = useQuery(
        ["users", query],
        () => searchUsers(query),
        {
            enabled: !!query
        }
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ q: searchTerm.trim() });
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </Box>

            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : query ? (
                <List>
                    {users.map(user => (
                        <ListItem 
                            key={user.id}
                            button
                            onClick={() => navigate(`/users/${user.id}`)}
                        >
                            <ListItemAvatar>
                                <Avatar>{user.name[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.name}
                                secondary={`@${user.username}`}
                            />
                        </ListItem>
                    ))}
                    {users.length === 0 && (
                        <Typography 
                            color="text.secondary" 
                            textAlign="center"
                            sx={{ mt: 2 }}
                        >
                            No users found
                        </Typography>
                    )}
                </List>
            ) : (
                <Typography 
                    color="text.secondary" 
                    textAlign="center"
                    sx={{ mt: 2 }}
                >
                    Enter a search term to find users
                </Typography>
            )}
        </Container>
    );
}