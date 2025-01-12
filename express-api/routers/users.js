const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");
const { optionalAuth } = require("../middlewares/optionalAuth");
const { wsService } = require("../services/websocket");

// Get latest notifications for auth user
router.get("/notifications", auth, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true
                    }
                }
            },
            orderBy: {
                created: 'desc'
            },
            take: 20
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a route to mark notifications as read
router.put("/notifications/read", auth, async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: {
                userId: req.user.id,
                read: false
            },
            data: {
                read: true
            }
        });

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a route to mark individual notification as read
router.put("/notifications/:id/read", auth, async (req, res) => {
    const notificationId = parseInt(req.params.id);

    try {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Check if the notification belongs to the authenticated user
        if (notification.userId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true
                    }
                }
            }
        });

        res.json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/verify", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
            _count: {
                select: {
                    followers: true,
                    follows: true
                }
            }
        }
    });

    // Remove password and add counts
    const { password, _count, ...userWithoutPassword } = user;
    res.json({
        ...userWithoutPassword,
        followersCount: _count.followers,
        followingCount: _count.follows
    });
});

router.get("/users/:id", optionalAuth, async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                followers: true,
                follows: true,
                posts: {
                    orderBy: { id: 'desc' },
                    include: {
                        user: true,
                        likes: true,
                        comments: {
                            include: { user: true }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the current user is following this user (if authenticated)
        let isFollowing = false;
        if (req.user) {
            const followRecord = await prisma.follow.findFirst({
                where: {
                    followerId: req.user.id,
                    followingId: userId
                }
            });
            isFollowing = !!followRecord;
        }

        const { password, followers, follows, ...userWithoutPassword } = user;
        res.json({
            ...userWithoutPassword,
            isFollowing,
            followerCount: followers.length,
            followingCount: follows.length,
            followers,
            follows
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/search", async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: q } },
                    { username: { contains: q } }
                ]
            },
            include: {
                _count: {
                    select: {
                        followers: true,
                        follows: true
                    }
                }
            },
            take: 10
        });

        // Remove sensitive data and add counts
        const sanitizedUsers = users.map(user => {
            const { password, _count, ...rest } = user;
            return {
                ...rest,
                followersCount: _count.followers,
                followingCount: _count.follows
            };
        });

        res.json(sanitizedUsers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/users", async (req, res) => {
	const { name, username, bio, password } = req.body;
	if (!name || !username || !password) {
		return res
			.status(400)
			.json({ msg: "name, username and password are required" });
	}

    const hash = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: { name, username, bio, password: hash },
	});

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
	res.status(201).json(userWithoutPassword);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: "username and password are required" });
    }

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            _count: {
                select: {
                    followers: true,
                    follows: true
                }
            }
        }
    });

    if (!user) {
        return res.status(404).json({ msg: "user not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
        // Remove password and add counts
        const { password: _, _count, ...userWithoutPassword } = user;
        const userData = {
            ...userWithoutPassword,
            followersCount: _count.followers,
            followingCount: _count.follows
        };
        
        // Create token with just the necessary user data
        const tokenData = {
            id: user.id,
            name: user.name,
            username: user.username
        };

        res.json({
            token: jwt.sign(tokenData, process.env.JWT_SECRET),
            user: userData
        });
    } else {
        res.status(401).json({ msg: "invalid password" });
    }
});

// Follow a user
router.post("/users/:id/follow", auth, async (req, res) => {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    try {
        // Check if trying to follow self
        if (followerId === followingId) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId,
                followingId
            }
        });

        if (existingFollow) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        // Create follow relationship
        await prisma.follow.create({
            data: {
                followerId,
                followingId
            }
        });

        // Create notification for the user being followed
        const notification = await prisma.notification.create({
            data: {
                type: 'FOLLOW',
                userId: followingId,
                actorId: followerId
            },
            include: {
                actor: true
            }
        });

        // Send real-time notification
        wsService.sendToUser(followingId, {
            type: 'notification',
            data: notification
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Unfollow a user
router.delete("/users/:id/follow", auth, async (req, res) => {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    try {
        // Check if trying to unfollow self
        if (followerId === followingId) {
            return res.status(400).json({ error: 'Cannot unfollow yourself' });
        }

        // Check if actually following
        const follow = await prisma.follow.findFirst({
            where: {
                followerId,
                followingId
            }
        });

        if (!follow) {
            return res.status(400).json({ error: 'Not following this user' });
        }

        // Remove follow relationship
        await prisma.follow.delete({
            where: {
                id: follow.id
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's followers
router.get("/users/:id/followers", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const followers = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true,
                    }
                }
            }
        });

        res.json(followers.map(f => f.follower));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get users that a user is following
router.get("/users/:id/following", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true,
                    }
                }
            }
        });

        res.json(following.map(f => f.following));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { usersRouter: router };