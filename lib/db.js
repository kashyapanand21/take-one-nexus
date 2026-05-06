import mysql from 'mysql2/promise';

const parseConnectionString = (url) => {
  try {
    const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const match = url.match(regex);
    if (match) {
      return {
        user: match[1],
        password: match[2],
        host: match[3],
        port: Number(match[4]),
        database: match[5].split('?')[0],
      };
    }
  } catch (err) {
    console.error('[DB] Failed to parse DATABASE_URL:', err.message);
  }
  return null;
};

const dbConfig = process.env.DATABASE_URL 
  ? parseConnectionString(process.env.DATABASE_URL)
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'take_one',
    };

const poolConfig = {
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
  queueLimit: 0,
  connectTimeout: 15000,
  ssl: (process.env.DB_SSL === 'true' || process.env.DATABASE_URL?.includes('sslmode=require')) 
    ? { rejectUnauthorized: true } 
    : undefined
};

// Singleton pattern for database connection in Next.js
let pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool(poolConfig);
} else {
  if (!global.pool) {
    global.pool = mysql.createPool(poolConfig);
  }
  pool = global.pool;
}

export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

export default pool;
