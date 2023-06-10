
const { PrivateMessagesDAO } = require("../lib/db/dao/MessagesDAO");
const PrivateMessage = require("../lib/db/models/PrivateMessage");
const { aggregatePrivateMessages } = require("../lib/db/utils");

const handleChatMessage = (socket) => {
  socket.on('chat_message', async (message) => {
    console.log(message);
    const { userId } = socket;
    try {
      // todo: validate friendship

      let to;
      let db_message;
      let messageDao;
      if (message.type === 'group') {
        // todo: process group message, save to db
        to = `group_${message.to}`
      } else {
        to = message.to;
        db_message = new PrivateMessage({
          senderId: userId,
          recipientId: to,
          text: message.message
        })
        messageDao = PrivateMessagesDAO;
      }
      
      const messageId = await messageDao.createMessage
      (db_message);

      socket.to(to).to(userId).emit('chat_message', {
        message: message.message,
        from: userId
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
}

const handleLoadChatHistory = (socket) => {
  socket.once('load_chat_history', async () => {
    try {
      const { userId } = socket;
      history = {};
      const privateMessages = await PrivateMessagesDAO.getUserPrivateMessages(userId);
      history.private = aggregatePrivateMessages(privateMessages, userId);
      history.group = {}; // todo: get group messages
      socket.emit('load_chat_history', history);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
}

module.exports = {
  handleChatMessage,
  handleLoadChatHistory
}