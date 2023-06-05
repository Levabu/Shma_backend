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
      const user = await db.query(`SELECT userName FROM ${this.table} WHERE userName = "${userName}";`) ;
      if (user && user.length) return true;
      else return false;
    } catch (error) {
      console.log("Unable to check for userName", error)
      return false;
    }
  }

  static async getNextID () {
    //always returns 10 - bug needs fixing
    try {
      const autoInc = await db.query(`SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = "${this.table}" AND table_schema = "${process.env.DB_DATABASE}";`);
      return autoInc[0].AUTO_INCREMENT;
    } catch (error) {
      console.log("Couldn't get next ID", error);
      return { error };
    }
  }

  // ... other methods
  // to send non-generic queries db.query() can be used
}

module.exports = UsersDAO;