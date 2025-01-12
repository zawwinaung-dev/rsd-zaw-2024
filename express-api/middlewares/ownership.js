const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function isPostOwner(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        next();
    } catch (error) {
        console.error('Post ownership check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function isCommentOwner(req, res, next) {
    try {
        const commentId = parseInt(req.params.id);
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        next();
    } catch (error) {
        console.error('Comment ownership check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    isPostOwner,
    isCommentOwner
};