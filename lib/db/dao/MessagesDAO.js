const { db } = require("../db");

class MessagesDAO {
  constructor(table) {
    this.table = table;
    this.toField = table === 'privateMessages' ? 'recipientId' : 'groupId';
  }

  async createMessage (message) {
    try {
      return await db.createOne(this.table, message);
    } catch (error) {
      console.log('Unable to create message', error);
      return { error };
    }
  }
}

class PrivateMessagesDAO extends MessagesDAO {
  constructor() {
    super('privateMessages');
  }

  async getUserPrivateMessages (userId) {
    try {
      return await db.query(`SELECT * FROM ${this.table} WHERE senderId = ? OR ${this.toField} = ? 
      ORDER BY createdAt;`, [userId, userId]);
    } catch (error) {
      console.log('Unable to get user messages', error);
      return { error };
    }
  }
}

class GroupMessagesDAO extends MessagesDAO {
  constructor() {
    super('groupMessages');
    this.m2mTable = 'usersGroups';
    this.users = 'users';
  }

  async getUserGroupsMessages (userId) {
    try {
      const query = `
        SELECT * FROM ${this.table} LEFT JOIN ${this.users} ON ${this.table}.senderId = ${this.users}.id
        WHERE ${this.table}.groupId IN (
          SELECT groupId FROM ${this.m2mTable} WHERE userId = ?
        )
        ORDER BY createdAt;
      `
      return await db.query(query, [userId]);
    } catch (error) {
      console.log('Unable to get group messages', error);
      return { error };
    }
  }
}

module.exports = {
  PrivateMessagesDAO: new PrivateMessagesDAO(),
  GroupMessagesDAO: new GroupMessagesDAO()
};
