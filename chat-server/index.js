const express = require("express");
const app = express();
require("express-ws")(app);

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let messages = [];
let clients = [];

app.ws("/connect", (ws, req) => {
    clients.push(ws);
    
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });
});

app.get("/", (req, res) => {
    res.json(messages);
});

app.post("/chat", (req, res) => {
    const { name, msg } = req.body;
    if(!name || !msg) {
        return res.status(400).json({ msg: 'name and msg required' });
    }

    messages.push({ 
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name, 
        msg 
    });
    
    clients.map(ws => {
        ws.send(JSON.stringify(messages));
    });

    res.sendStatus(200);
});

app.listen(8888, () => {
    console.log("Chat server listening at 8888");
});