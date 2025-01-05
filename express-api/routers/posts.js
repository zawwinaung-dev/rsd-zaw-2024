const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth, isOwner } = require("../middlewares/auth");

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
        orderBy: { id: 'desc'},
    });

    // setTimeout(() => {
    //     res.json(posts);
    // }, 2000);
    
    res.json(posts);
});

router.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id)},
        include: { 
            user: true, 
            likes: true,
            comments: { 
                include: { user: true }
            }
        },
    })
    res.json(post);
});

router.post('/posts', auth, async ( req, res) => {
    const { content } = req.body;
    const user = res.locals.user;

    if(!content) {
        return res.status(400).json({ msg: 'content is required'});
    }

    const post = await prisma.post.create({
        data: {
            content,
            userId: Number(user.id),
        },
        include: { user: true},
    });

    res.status(201).json(post);
});

router.post('/posts/:id/like', auth, async (req, res) => {
    const { id } = req.params;
    const user = res.locals.user;

    try {
        await prisma.like.create({
            data: {
                postId: Number(id),
                userId: user.id,
            }
        });

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { user: true, likes: true },
        });
        res.json(post);
    } catch (err) {
        if(err.code = "P2002") {
            return res.status(400).json({ msg: "Already liked" });
        }
        res.status(500).json({ msg: err.message });
    }
});

router.delete('/posts/:id', auth, isOwner("post"), async (req, res) => {
    const { id } = req.params;

    const post = await prisma.post.delete({
        where: { id: Number(id) }
    });

    res.json(post);
})

router.delete('/posts/:id/like', auth, async (req, res) => {
    const { id } = req.params;
    const user = res.locals.user;

    try {
        await prisma.like.deleteMany({
            where: {
                postId: Number(id),
                userId: user.id,
            }
        });

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { user: true, likes: true },
        });
        res.json(post);
    } catch (err) {
        if(err.code === 'P2025') {
            return res.status(400).json({ msg: "Not liked yet" });
        }
        res.status(500).json({ msg: err.message });
    }
});

module.exports = { postsRouter: router };