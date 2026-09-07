const mysql = require('mysql2/promise');
require('dotenv').config();

const useSSL = String(process.env.DB_SSL).toLowerCase() === 'true';

const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
// Clever Cloud's free MySQL plan caps this user at only 5 total connections.
// Vercel can run several serverless instances at once, each with its own pool,
// so we keep each pool tiny and release idle connections quickly to avoid
// hitting "max_user_connections" errors under normal traffic.
const poolOptions = {
  waitForConnections: true,
  connectionLimit: 2,
  maxIdle: 1,
  idleTimeout: 20000,
  queueLimit: 0,
  ssl: useSSL ? { rejectUnauthorized: true } : undefined
};

const pool = connectionUrl
  ? mysql.createPool(connectionUrl, poolOptions)
  : mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campus_food_ordering',
      ...poolOptions
    });

// Quick startup check so connection problems surface immediately in logs
pool.getConnection()
  .then((conn) => {
    console.log('MySQL connection pool established.');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection failed on startup:', err.message);
  });

module.exports = pool;
