import {
	Box,
	Card,
	CardContent,
	IconButton,
	Typography,
	Avatar,
} from "@mui/material";

import { useApp } from "../AppProvider";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

const API = "http://localhost:8080";

export default function Comment({ comment, remove }) {
	const { auth } = useApp();

	return (
		<Card 
			variant="outlined" 
			sx={{ 
				mb: 1,
				'&:last-child': {
					mb: 0
				}
			}}>
			<CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}>
					<Box sx={{ display: "flex", gap: 2, mb: 1 }}>
						<Avatar
							sx={{
								width: 24,
								height: 24,
								background: blue[500],
							}}
						/>
						<Typography 
							variant="body2"
							sx={{ 
								fontWeight: "bold",
								lineHeight: "24px"
							}}>
							{comment.user.name}
						</Typography>
					</Box>
					{auth && auth.id === comment.user.id && (
						<IconButton
							size="small"
							onClick={() => remove(comment.id)}>
							<DeleteIcon sx={{ fontSize: 18, color: "grey" }} />
						</IconButton>
					)}
				</Box>

				<Typography variant="body2" sx={{ pl: 5 }}>
					{comment.content}
				</Typography>
			</CardContent>
		</Card>
	);
}