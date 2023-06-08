const { error } = require('console');
const { db } = require('../db');

class UsersDAO {
  static table = 'users';

  static async getUserById (id) {
    try {
      return await db.getOneByUniqueField(this.table, 'id', id);
    } catch (error) {
      console.log('Unable to get user by id', error);
      return { error };
    }
  };

  static async getUsersByIds (arr) {
    try {
      const idsString = `(${arr.join()})`;
      return await db.query(`SELECT * FROM ${this.table} WHERE id IN ${idsString};`);
    } catch (error) {
      console.log("Unable to get users", error)
      return { error }
    }
  }

  static async getUserByUsername (userName) {
    try {
      return await db.query(`SELECT * FROM ${this.table} WHERE userName = "${userName}";`);
    } catch (error) {
      console.log('Unable to get user by username', error);
      return { error };
    }
  };

  static async addUser (userName, firstName, lastName, hashedPassword) {
    try {
      await db.query(`INSERT INTO ${this.table} (userName, firstName, lastName, password) VALUES ("${userName}", "${firstName}", "${lastName}", "${hashedPassword}");`);
    } catch (error) {
      console.log("Unable to add new user", error);
      return { error };
    }
  }

  static async checkForUserName (userName) {
    try {
      const user = await db.query(`SELECT userName FROM ${this.table} WHERE userName = "${userName}";`);
      if (user && user.length) return true;
      else return false;
    } catch (error) {
      console.log("Unable to check for userName", error)
      return false;
    }
  }

  // ... other methods
  // to send non-generic queries db.query() can be used
}

module.exports = UsersDAO;