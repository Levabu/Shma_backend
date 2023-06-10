const handleChatMessage = (socket) => {
  socket.on('chat_message', (message) => {
    const { userId } = socket;
    try {
      // validate friendship

      // save to db

      let to;
      if (message.type === 'group') {
        // not implemented yet
        to = `group_${message.to}`
      } else {
        to = message.to;
      }
      from = userId;
      socket.to(to).to(from).emit('chat_message', {
        message: message.message,
        from
      });
    } catch (error) {
      socket.emit('connect_error', error.message);
    }
    
  });
}

module.exports = {
  handleChatMessage
}