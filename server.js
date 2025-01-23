const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const routes = require('./routes');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 配置
app.use(cors({
  origin: 'https://biolink-app.onrender.com', // 替换为前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 中间件
app.use(express.json());

// 初始化数据库
initDb();

// 路由配置
app.use('/api', routes);

// React 静态文件
const staticPath = path.join(__dirname, 'client/build');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  console.error('Static files not found. Ensure React app is built.');
}

// 启用 HTTP 或 HTTPS
const server = http.createServer(app); // 如果需要 HTTPS，改为 https.createServer

// Socket.IO 配置
const io = new Server(server);
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
