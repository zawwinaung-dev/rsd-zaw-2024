import { Container, Box, Typography, CircularProgress, Divider } from "@mui/material";
import { useParams } from "react-router";
import { useQuery } from "react-query";

import Item from "../components/Item";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { useApp } from "../AppProvider";

const API = "http://localhost:8080";

const fetchPost = async (id) => {
    const res = await fetch(`${API}/posts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
};

export default function Post() {
    const { id } = useParams();
    const { auth } = useApp();
    
    const { data: post, isLoading, error } = useQuery(
        ["post", id],
        () => fetchPost(id)
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
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography color="error">
                    Error loading post: {error.message}
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Item post={post} />
            
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Comments ({post.comments?.length || 0})
                </Typography>
                <Divider />
                
                <Box sx={{ mt: 2 }}>
                    {post.comments?.map(comment => (
                        <Comment 
                            key={comment.id} 
                            comment={comment}
                            remove={() => {
                                // TODO: Implement comment deletion
                                console.log("Delete comment:", comment.id);
                            }}
                        />
                    ))}
                </Box>

                {auth ? (
                    <CommentForm postId={post.id} />
                ) : (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        Please login to comment
                    </Typography>
                )}
            </Box>
        </Container>
    );
}