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

  static async getUserByUsername (userName) {
    try {
      return await db.getOneByUniqueField(this.table, 'userName', userName);
    } catch (error) {
      console.log('Unable to get user by username', error);
      return { error };
    }
  };

  // ... other methods
  // to send non-generic queries db.query() can be used
}

module.exports = UsersDAO;