const express = require("express");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/***
 * @type {express.RequestHandler}
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

function auth(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    if(!token) {
        return res.status(401).json({ msg: "token is required"});
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "invalid token"});
    }
}

function isOwner(type) {
    return async (req, res, next) => {
        if(type === "post") {
            const id = req.params.id;
            const post = await prisma.post.findUnique({
                where: { id: Number(id)},
            });

            if(res.locals.user.id === post.userId) {
                return next();
            }
        }

        res.status(401).json({ msg: "forbidden" });
    }

}

module.exports = { auth, isOwner };