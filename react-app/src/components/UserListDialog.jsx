import { 
    Dialog, 
    DialogTitle, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Avatar,
    CircularProgress,
    Typography,
    Box
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router";
import { useQuery } from "react-query";

const API = "http://localhost:8080";

const fetchUsers = async (id, type) => {
    let endpoint;
    if (type === 'followers' || type === 'following') {
        endpoint = `/users/${id}/${type}`;
    } else if (type === 'likes') {
        endpoint = `/posts/${id}/likes`;
    }
    const res = await fetch(`${API}${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${type}`);
    return res.json();
};

export default function UserListDialog({ open, onClose, userId, type, title }) {
    const navigate = useNavigate();

    const { data: users, isLoading, error } = useQuery(
        ["users", userId, type],
        () => fetchUsers(userId, type),
        {
            enabled: open
        }
    );

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`);
        onClose();
    };

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ p: 3 }}>
                    <Typography color="error">
                        Error loading users: {error.message}
                    </Typography>
                </Box>
            ) : (
                <List sx={{ pt: 0 }}>
                    {users?.map((user) => (
                        <ListItem 
                            button 
                            onClick={() => handleUserClick(user.id)} 
                            key={user.id}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[500] }}>
                                    {user.name[0]}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={user.name} 
                                secondary={`@${user.username}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Dialog>
    );
}