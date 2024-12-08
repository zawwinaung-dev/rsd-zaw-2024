// npm i express cors body-parser nodemon

const express = require("express");
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany({
        take: 20,
        orderBy: { id: 'desc'},
    });

    res.json(posts);
});

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id)},
    })
    res.json(post);
});

app.post('/posts', async ( req, res) => {
    const { content } = req.body;
    if(!content) {
        return res.status(400).json({ msg: 'content is required'});
    }

    const post = await prisma.post.create({
        data: {
            content,
            userId: 1,
        }
    });

    res.status(201).json(post);
});

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    const post = await prisma.post.delete({
        where: { id: Number(id) }
    });

    res.json(post);
})

app.listen(8080, () => {
    // npm nodemon index.js
    console.log("Express API running at 8080");
});