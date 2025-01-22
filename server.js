const express = require('express');
const cors = require('cors'); // 引入 cors 中间件
const { initDb } = require('./db');
const routes = require('./routes');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path'); // 引入 path 模块

const app = express();
const server = http.createServer(app); // 使用 https 创建服务器
const io = new Server(server); // 创建 Socket.IO 服务器
const PORT = process.env.PORT || 5000;

// 使用 cors 中间件
app.use(cors());

// 中间件
app.use(express.json());

// 初始化数据库
initDb();

// 加载路由
app.use('/api', routes);

// 配置 React 应用的静态文件
app.use(express.static(path.join(__dirname, 'client/build')));

// 当访问未匹配的路由时，返回 React 应用的 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Socket.IO 事件处理
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Message from client:', data);
    io.emit('message', `Server received: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
