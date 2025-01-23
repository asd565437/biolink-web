const { Pool } = require('pg');

let pool;

const initDb = () => {
  if (!pool) {
    pool = new Pool({
      user: process.env.DATABASE_USER, // 数据库用户名
      host: process.env.DATABASE_HOST, // 数据库主机名
      database: process.env.DATABASE_NAME, // 数据库名称
      password: process.env.DATABASE_PASSWORD, // 数据库密码
      port: process.env.DATABASE_PORT, // 数据库端口
      ssl: {
        rejectUnauthorized: false, // 允许不验证证书的 SSL 连接
      },
    });
    console.log('Database connection pool created.');
  }
  return pool;
};

const getDb = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call initDb first.');
  }
  return pool;
};

module.exports = { initDb, getDb };