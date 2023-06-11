
const FriendshipsDAO = require("../lib/db/dao/FriendshipsDAO");
const { PrivateMessagesDAO, GroupMessagesDAO } = require("../lib/db/dao/MessagesDAO");
const GroupMessage = require("../lib/db/models/GroupMessage");
const PrivateMessage = require("../lib/db/models/PrivateMessage");
const { aggregatePrivateMessages, aggregateGroupMessages } = require("../lib/db/utils");

const handleChatMessage = (socket) => {
  socket.on('chat_message', async (message) => {
    const { userId } = socket;
    try {
      let to;
      let db_message;
      let messageDao;
      if (message.type === 'group') {
        to = `group_${message.to}`
        if (!socket.rooms.has(to)) {
          throw new Error('You are not a member of this group');
        }

        db_message = new GroupMessage ({
          senderId: userId,
          groupId: message.to,
          text: message.message
        })
        messageDao = GroupMessagesDAO;
      } else {
        to = message.to;

        const friendship = await FriendshipsDAO.getFriendship(userId, to);
        if (!friendship || friendship.status !== 'accepted') {
          throw new Error('You are not friends with this user');
        }

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
        from: userId,
        type: message.type
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
}

module.exports = {
  handleChatMessage
}