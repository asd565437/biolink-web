// backend/db.js
const { Pool } = require('pg');

let pool;

const initDb = () => {
  if (!pool) {
    pool = new Pool({
        user: 'asd565437',
        host: 'localhost',
        database: 'postgres',
        password: 'asd565437',
        port: 5432,
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
