const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require('../settings');

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
}

class DB {
  constructor() {
    this.pool = mysql.createConnection(config);
  }

  query = (query, values) => {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        }
        if (!results) return resolve();
        const parsedResults = JSON.parse(JSON.stringify(results));
        return resolve(parsedResults);
      });
    });
  }

  getOneByUniqueField = async (table, field, value) => {
    const query = `SELECT * FROM ${table} WHERE ${field} = ?`;
    const result = await this.query(query, value);
    return result[0];
  }

  createOne = async (table, item) => {
    const query = `INSERT INTO ${table} SET ?`;
    const result = await this.query(query, [item]);
    return result.insertId;
  }

  // ... other generic methods
}

module.exports = {
  db: new DB(),
};