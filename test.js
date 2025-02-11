const fs = require('fs');

// 读取私钥
const privateKey = fs.readFileSync('private-key.pem', 'utf8');

console.log(privateKey);