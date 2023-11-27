import mysql from 'mysql';
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const db = mysql.createConnection({
  host: DB_HOST,
  port: 3306,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
});
