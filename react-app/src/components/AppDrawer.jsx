import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Avatar,
	Typography,
} from "@mui/material";

import {
	Home as HomeIcon,
	Person as ProfileIcon,
	PersonAdd as RegisterIcon,
	Login as LoginIcon,
	Logout as LogoutIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { green } from "@mui/material/colors";

export default function AppDrawer() {
	const { showDrawer, setShowDrawer, auth, setAuth } = useApp();
	const navigate = useNavigate();

	const toggleDrawer = newOpen => () => {
		setShowDrawer(newOpen);
	};

	const DrawerList = (
		<Box
			sx={{ width: 300 }}
			role="presentation"
			onClick={toggleDrawer(false)}>
			<Box
				sx={{
					height: 200,
					padding: 2,
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					gap: 2,
				}}>
				{auth && auth.name && (
					<>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Avatar
								sx={{
									width: 64,
									height: 64,
									background: green[500],
								}}>
								{auth.name[0] || "?"}
							</Avatar>
							<Box>
								<Typography variant="h6">{auth.name}</Typography>
								<Box sx={{ display: "flex", gap: 2 }}>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
										{auth.followersCount || 0} followers
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
										{auth.followingCount || 0} following
									</Typography>
								</Box>
							</Box>
						</Box>
					</>
				)}
			</Box>
			<Divider />

			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/")}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />

			{auth && (
				<List>
					<ListItem disablePadding>
						<ListItemButton onClick={() => navigate(`/users/${auth.id}`)}>
							<ListItemIcon>
								<ProfileIcon />
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => {
								setAuth(false);
								localStorage.removeItem("token");
							}}>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItemButton>
					</ListItem>
				</List>
			)}

			{!auth && (
				<List>
					<ListItem disablePadding>
						<ListItemButton onClick={() => navigate("/register")}>
							<ListItemIcon>
								<RegisterIcon />
							</ListItemIcon>
							<ListItemText primary="Register" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => navigate("/login")}>
							<ListItemIcon>
								<LoginIcon />
							</ListItemIcon>
							<ListItemText primary="Login" />
						</ListItemButton>
					</ListItem>
				</List>
			)}
		</Box>
	);

	return (
		<div>
			<Drawer
				open={showDrawer}
				onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</div>
	);
}