const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");
const { isCommentOwner } = require("../middlewares/ownership");
const { wsService } = require("../services/websocket");

router.post("/posts/:id/comments", auth, async (req, res) => {
	const postId = req.params.id;
    const userId = req.user.id;
	const { content } = req.body;

	try {
        // Get post to check owner
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: { userId: true }
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

		const comment = await prisma.comment.create({
			data: {
				content,
				postId: parseInt(postId),
				userId: userId,
			},
			include: {
				user: true,
			},
		});

        // Create notification if the comment is not from post owner
        if (post.userId !== userId) {
            const notification = await prisma.notification.create({
                data: {
                    type: "COMMENT",
                    userId: post.userId,
                    actorId: userId,
                    postId: parseInt(postId),
                    read: false,
                },
                include: {
                    actor: true,
                    post: true
                }
            });

            // Send real-time notification
            wsService.sendToUser(post.userId, {
                type: 'notification',
                data: notification
            });
        }

		res.json(comment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.delete("/comments/:id", auth, isCommentOwner, async (req, res) => {
	const commentId = parseInt(req.params.id);

	try {
		// Delete the comment
		await prisma.comment.delete({
			where: { id: commentId },
		});

		res.json({ message: "Comment deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = { commentsRouter: router };