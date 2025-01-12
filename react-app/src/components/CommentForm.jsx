import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const API = "http://localhost:8080";

const createComment = async ({ postId, content }) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return res.json();
};

export default function CommentForm({ postId }) {
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const { mutate: comment, isLoading } = useMutation(createComment, {
        onSuccess: () => {
            queryClient.invalidateQueries(["post", postId]);
            setContent("");
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        if (!content.trim()) return;
        comment({ postId, content });
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
        >
            <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={isLoading}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={!content.trim() || isLoading}
                >
                    {isLoading ? "Commenting..." : "Comment"}
                </Button>
            </Box>
        </Box>
    );
}