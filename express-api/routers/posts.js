const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");
const { isPostOwner } = require("../middlewares/ownership");
const { wsService } = require("../services/websocket");

router.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany({
        include: { 
            user: true, 
            likes: true,
            comments: {
                include: { user: true }
            }
        },
        take: 20,
        orderBy: { id: 'desc' }
    });

    res.json(posts);
});

router.get('/posts/following', auth, async (req, res) => {
    try {
        // Get posts from users that the current user follows
        const posts = await prisma.post.findMany({
            where: {
                user: {
                    followers: {
                        some: {
                            followerId: req.user.id
                        }
                    }
                }
            },
            include: { 
                user: true, 
                likes: true,
                comments: {
                    include: { user: true }
                }
            },
            take: 20,
            orderBy: { id: 'desc' }
        });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
        include: { 
            user: true, 
            likes: true,
            comments: {
                include: { user: true }
            }
        },
        where: { id: Number(id) },
    });

    res.json(post);
});

router.post('/posts', auth, async (req, res) => {
    const { content } = req.body;
    const user = req.user;

    if(!content) {
        return res.status(400).json({ msg: 'content is required' });
    }

    const post = await prisma.post.create({
        data: { content, userId: Number(user.id) },
        include: { 
            user: true,
            likes: true,
            comments: {
                include: { user: true }
            }
        },
    });

    res.status(201).json(post);
});

router.delete('/posts/:id', auth, isPostOwner, async (req, res) => {
    const { id } = req.params;

    try {
        // Delete all likes for this post
        await prisma.like.deleteMany({
            where: { postId: Number(id) }
        });

        // Delete all comments for this post
        await prisma.comment.deleteMany({
            where: { postId: Number(id) }
        });

        // Now delete the post
        const post = await prisma.post.delete({
            where: { id: Number(id) }
        });

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/posts/:id/like', auth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Check if post exists and get post owner
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: { userId: true }
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const like = await prisma.like.create({
            data: {
                postId: Number(id),
                userId: userId,
            }
        });

        // Create notification if the like is not from post owner
        if (post.userId !== userId) {
            const notification = await prisma.notification.create({
                data: {
                    type: "LIKE",
                    userId: post.userId,
                    actorId: userId,
                    postId: Number(id),
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

        res.json(like);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Already liked" });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/posts/:id/like', auth, async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const result = await prisma.like.deleteMany({
			where: {
                postId: Number(id),
                userId: user.id,
            }
		});

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { 
                user: true, 
                likes: true,
                comments: {
                    include: { user: true }
                }
            }
        });

        res.json(post);
    } catch(err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get('/posts/:id/likes', async (req, res) => {
    const postId = Number(req.params.id);

    try {
        const likes = await prisma.like.findMany({
            where: {
                postId
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true,
                        created: true
                    }
                }
            }
        });

        // Extract just the user objects from the likes
        const users = likes.map(like => like.user);
        res.json(users);
    } catch(err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = { postsRouter: router };