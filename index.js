const express = require('express')
const api = require('./api')
const {createJob} = require('./cron')
const app = express()

const http = require('http');
const server = http.createServer(app); // 启动一个http服务器
const { Server } = require("socket.io");
const io = new Server(server);   // 启动一个io服务器

// socket io 事件监听
io.on('connection', (socket) => {
    console.log('a user connected');
    createJob(socket);
    // 对前端发送的chat message事件进行监听
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/get_comment_list/:pageNum', async (req, res, next) => {
    const commentList = await api.getCommentList(req.params.pageNum)
    console.log(commentList)
    res.send('hello world')
})



