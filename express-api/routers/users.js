const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");

router.get("/verify", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: res.locals.user.id },
    });

    res.json(user);
})

router.post("/users", async (req, res) => {
    const { name, username, bio, password } = req.body;
    if(!name || !username || !password ) {
        return res.status(400)
                  .json({ msg: "name, username and password are required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, username, bio, password: hash },
    })

    res.status(201).json(user);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password ) {
        return res.status(400).json({ msg: "username and password are required."});
    }

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return res.status(404).json({ msg: "user not found."});
    }

    if(await bcrypt.compare(user.password, password)) {
        return res.status(401).json({ msg: "invalid password. "});
    }

    res.json({ token: jwt.sign(user, process.env.JWT_SECRET) });
})

module.exports = { usersRouter: router };