const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth, isOwner } = require("../middlewares/auth");

// Create a new comment
router.post('/comments', auth, async (req, res) => {
    const { content, postId } = req.body;
    const user = res.locals.user;

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                userId: user.id
            },
            include: {
                user: true
            }
        });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment
router.delete('/comments/:id', auth, async (req, res) => {
    const commentId = parseInt(req.params.id);
    
    try {
        // Check if comment exists and user is the owner
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.userId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Delete the comment
        await prisma.comment.delete({
            where: { id: commentId }
        });

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { commentsRouter: router };