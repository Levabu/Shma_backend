
const FriendshipsDAO = require("../lib/db/dao/FriendshipsDAO");
const { PrivateMessagesDAO, GroupMessagesDAO } = require("../lib/db/dao/MessagesDAO");
const UsersDAO = require("../lib/db/dao/usersDAO");
const GroupMessage = require("../lib/db/models/GroupMessage");
const PrivateMessage = require("../lib/db/models/PrivateMessage");

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
        to: message.to,
        type: message.type,
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
}

const handleChangeFriendRequestStatus = (io, socket) => {
  socket.on('change_friend_request_status', async (data) => {
    const { userId } = socket;
    const { id, status } = data;
    try {
      const friendship = await FriendshipsDAO.getFriendship(id, userId);
      if (!friendship) {
        throw new Error('Friendship not found');
      }
      if (friendship.status !== 'pending') {
        throw new Error('Friendship is not pending');
      }
      if (!['accepted', 'declined', 'canceled'].includes(status)) {
        throw new Error('Invalid status');
      }

      if (status === 'accepted') {
        await FriendshipsDAO.confirmFriendship(id, userId);
      } else {
        await FriendshipsDAO.deleteFriendship(id, userId);
      }
      
      io.to(userId).to(id).emit('change_friend_request_status', {
        from: friendship.fromId,
        to: friendship.fromId === friendship.userId1 ? friendship.userId2 : friendship.userId1,
        status
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
}

const handleSendFriendRequest = (io, socket) => {
  socket.on('send_friend_request', async (data, callback) => {
    const { userId } = socket;
    const { to } = data;

    try {
      const friendship = await FriendshipsDAO.getFriendship(userId, to);
      if (friendship) {
        return callback({status: 400, message: 'Friendship already exists'});
      }

      const isCreatedSuccessfully = await FriendshipsDAO.makeFriendRequest(userId, to);
      if (!isCreatedSuccessfully) {
        return callback({status: 400, message: 'Could not create friendship'});
      }

      const users = await UsersDAO.getUsersByIds([to, userId]);
      if (!users || users.length !== 2) {
        return callback({status: 400, message: 'User not found'});
      }
      const fromUser = users.find(user => user.id == userId);
      const toUser = users.find(user => user.id == to);
      delete fromUser.password;
      delete toUser.password;

      callback({status: 201});
      io.to(to).to(userId).emit('send_friend_request', {
        toUser,
        fromUser,
        fromId: userId,
      });
    } catch (error) {
      callback({status: 400, message: error.message});
    }
  });
}

module.exports = {
  handleChatMessage,
  handleChangeFriendRequestStatus,
  handleSendFriendRequest
}