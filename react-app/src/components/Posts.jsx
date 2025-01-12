import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import Item from "./Item";

const API = "http://localhost:8080";

const fetchPosts = async (type = "latest") => {
    const endpoint = type === "following" ? "/posts/following" : "/posts";
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const res = await fetch(`${API}${endpoint}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
};

export default function Posts({ type = "latest" }) {
    const { data: posts, error, isLoading } = useQuery(
        ["posts", type],
        () => fetchPosts(type),
        {
            enabled: type !== "following" || !!localStorage.getItem("token")
        }
    );

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
                Error loading posts: {error.message}
            </Typography>
        );
    }

    if (!posts?.length) {
        return (
            <Typography 
                color="text.secondary" 
                textAlign="center" 
                sx={{ mt: 4 }}
            >
                {type === "following" 
                    ? "No posts from people you follow" 
                    : "No posts yet"}
            </Typography>
        );
    }

    return (
        <Box>
            {posts.map((post) => (
                <Item key={post.id} post={post} />
            ))}
        </Box>
    );
}