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

module.exports = {
  aggregatePrivateMessages
}