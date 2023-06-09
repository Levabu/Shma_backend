const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

const PORT = process.env.PORT;

module.exports = {
  JWT_SECRET_KEY,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  PORT
};