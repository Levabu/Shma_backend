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



module.exports = {
  privateMessagesDAO: new MessagesDAO('privateMessages'),
  groupMessagesDAO: new MessagesDAO('groupMessages')
};
