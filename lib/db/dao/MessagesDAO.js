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
      console.log("Unable to create message", error);
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
      return await db.query(`SELECT * FROM ${this.table} WHERE senderId = ${userId} OR ${this.toField} = ${userId} 
      ORDER BY createdAt;`);
    } catch (error) {
      console.log("Unable to get user messages", error);
      return { error };
    }
  }
}

class GroupMessagesDAO extends MessagesDAO {
  constructor() {
    super('groupMessages');
  }
}

module.exports = {
  PrivateMessagesDAO: new PrivateMessagesDAO(),
  GroupMessagesDAO: new GroupMessagesDAO()
};
