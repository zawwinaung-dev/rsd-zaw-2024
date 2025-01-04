import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Typography,
  ButtonGroup,
} from "@mui/material";

import { 
  Delete as DeleteIcon,
  FavoriteBorderOutlined as LikeIcon,
  Favorite as LikedIcon,
  ChatBubbleOutline as CommentIcon,

 } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { useApp } from "../AppProvider";

export default function Item({ post, remove }) {
  const { auth } = useApp();
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, background: blue[500] }} />
            <Typography>{post.user.name}</Typography>
          </Box>

          {auth && auth.id === post.user.id && (
            <IconButton size="small" onClick={() => remove(post.id)}>
              <DeleteIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}
        </Box>
        <Box>
          <Typography>{post.content}</Typography>
        </Box>
        <Box 
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <ButtonGroup>
            <IconButton size="small">
              <LikeIcon 
                color="error"
                sx={{ fontSize: 21}}
              />
            </IconButton>
            <Button
              variant="text"
              size="small"
            >
              8
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <IconButton size="small">
              <CommentIcon 
                color="success"
                sx={{ fontSize: 21}}
              />
            </IconButton>
            <Button
              variant="text"
              size="small"
            >
              8
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
