const { db } = require('../db');

class GroupsDAO {
  static table = 'groupChats';
  static m2mTable = 'usersGroups';
  static usersTable = 'users';

  static async getUserGroups(userId) {
    const query = `
    SELECT ${this.table}.id, ${this.table}.name FROM ${this.table} 
    JOIN ${this.m2mTable} ON ${this.table}.id = ${this.m2mTable}.groupId
    JOIN ${this.usersTable} ON ${this.usersTable}.id = ${this.m2mTable}.userId
    WHERE ${this.usersTable}.id = ?;
    `;
    try {
        return await db.query(query, [userId]);
    } catch (error) {
      console.log('Unable to get user groups', error);
      return { error };
    }
  }

  static async isUserInGroup(userId, groupId) {
    const query = `
    SELECT * FROM ${this.m2mTable} WHERE userId = ? AND groupId = ?;
    `;
    try {
      const result = await db.query(query, [userId, groupId]);
      if (result && result.length) return true;
      else return false;
    } catch (error) {
      console.log('Unable to check if user in group', error);
      return false;
    }
  }
}

module.exports = GroupsDAO;