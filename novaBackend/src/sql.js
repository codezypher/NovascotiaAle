import mysql from 'mysql2/promise';

// Support either MYSQL_* or DB_* .env keys
const host = process.env.MYSQL_HOST || process.env.DB_HOST;
const user = process.env.MYSQL_USER || process.env.DB_USER;
const password = process.env.MYSQL_PASSWORD || process.env.DB_PASS;
const database = process.env.MYSQL_DB || process.env.DB_NAME;

export const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});
