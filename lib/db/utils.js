const aggregatePrivateMessages = (messages, userId) => {
  privateMessages = {};
  for (const message of messages) {
    const { senderId, recipientId, text, createdAt } = message;
    const fromSelf = senderId === userId;
    const otherUser = fromSelf ? recipientId : senderId;
    if (!privateMessages[otherUser]) {
      privateMessages[otherUser] = [];
    }
    privateMessages[otherUser].push({
      fromSelf,
      message: text,
      createdAt
    });
  }
  return privateMessages;
}

const aggregateGroupMessages = (messages, userId) => {
  groupMessages = {};
  for (const message of messages) {
    const { senderId, groupId, text, createdAt } = message;
    const fromSelf = senderId === userId;
    if (!groupMessages[groupId]) {
      groupMessages[groupId] = [];
    }
    groupMessages[groupId].push({
      fromSelf,
      from: senderId,
      message: text,
      createdAt
    });
  }
  return groupMessages;
}

module.exports = {
  aggregatePrivateMessages,
  aggregateGroupMessages
}