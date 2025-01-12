const express = require("express");
const app = express();
const expressWs = require('express-ws')(app);
const jwt = require('jsonwebtoken');

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

const { usersRouter } = require("./routers/users");
const { postsRouter } = require("./routers/posts");
const { commentsRouter } = require("./routers/comments");
const { wsService } = require("./services/websocket");

app.use(usersRouter);
app.use(postsRouter);
app.use(commentsRouter);

// WebSocket endpoint with JWT auth
app.ws('/notifications', (ws, req) => {
    const token = req.query.token;
    if (!token) {
        ws.close(1008, 'Token required');
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ws.userId = decoded.id;
        wsService.addConnection(ws);

        ws.on('close', () => {
            wsService.removeConnection(ws);
        });
    } catch (error) {
        ws.close(1008, 'Invalid token');
    }
});

app.listen(8080, () => {
    console.log("Express API running at 8080");
});