const mysql = require('mysql');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

  // ... other generic methods
}

module.exports = {
  db: new DB(),
};