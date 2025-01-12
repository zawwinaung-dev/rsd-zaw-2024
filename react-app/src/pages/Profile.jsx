import {
	Container,
	Box,
	Typography,
	CircularProgress,
	Avatar,
	Button
} from "@mui/material";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import { useState } from "react";

import Item from "../components/Item";
import FollowButton from "../components/FollowButton";
import UserListDialog from "../components/UserListDialog";
import { useApp } from "../AppProvider";

const API = "http://localhost:8080";

const fetchUser = async (id, token) => {
	const res = await fetch(`${API}/users/${id}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
	if (!res.ok) throw new Error("Failed to fetch user");
	return res.json();
};

export default function Profile() {
	const { id } = useParams();
	const { auth } = useApp();
    const [dialogType, setDialogType] = useState(null);

	const {
		data: user,
		isLoading,
		error,
	} = useQuery(
        ["user", id], 
        () => fetchUser(id, auth?.token),
        {
            enabled: !!id,
        }
    );

    const handleOpenDialog = (type) => {
        setDialogType(type);
    };

    const handleCloseDialog = () => {
        setDialogType(null);
    };

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ mt: 4, textAlign: "center" }}>
				<Typography color="error">
					Error loading profile: {error.message}
				</Typography>
			</Box>
		);
	}

	return (
		<Container maxWidth="sm" sx={{ py: 4 }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					mb: 4,
				}}>
				<Avatar sx={{ width: 120, height: 120, mb: 2, }}>
					{user.name[0]}
				</Avatar>
				<Typography variant="h4" gutterBottom>
					{user.name}
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" gutterBottom>
					@{user.username}
				</Typography>
				{user.bio && (
					<Typography variant="body1" textAlign="center" sx={{ mt: 1, mb: 2 }}>
						{user.bio}
					</Typography>
				)}
                
                {auth && auth.id !== user.id && (
                    <Box sx={{ mb: 2 }}>
                        <FollowButton userId={user.id} isFollowing={user.isFollowing} />
                    </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                    <Button 
                        variant="text" 
                        color="inherit"
                        onClick={() => handleOpenDialog('followers')}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {user.followerCount || 0} followers
                        </Typography>
                    </Button>
                    <Button 
                        variant="text"
                        color="inherit"
                        onClick={() => handleOpenDialog('following')}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {user.followingCount || 0} following
                        </Typography>
                    </Button>
                </Box>
			</Box>

			<Box sx={{ mt: 2 }}>
				{user.posts?.map(post => (
					<Item key={post.id} post={post} />
				))}
			</Box>

            {dialogType && (
                <UserListDialog
                    open={!!dialogType}
                    onClose={handleCloseDialog}
                    userId={user.id}
                    type={dialogType}
                    title={dialogType === 'followers' ? 'Followers' : 'Following'}
                />
            )}
		</Container>
	);
}