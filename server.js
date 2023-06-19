const http = require('http');

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { validResponse, createdResponse, serverError } = require('./lib/responseHandlers.js');
const httpAuth = require('./lib/middlewares/http/auth.js');
const socketsAuth = require('./lib/middlewares/sockets/auth.js');
const { PORT } = require('./lib/settings.js');
const { handleChatMessage, handleChangeFriendRequestStatus, handleSendFriendRequest } = require('./sockets/events.js');
const { addConnection, removeConnection } = require('./sockets/connections.js');
const GroupsDAO = require('./lib/db/dao/GroupsDAO.js');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.customSend = (responseHandler) => res.status(responseHandler.status).send(responseHandler.payload);
  res.ok = (data) => res.customSend(validResponse(data));
  res.create = (value) => res.customSend(createdResponse(value));
  res.serverErr = (err) => res.customSend(serverError(err));
  next();
})

app.use(httpAuth);

app.use('/api/v1', require('./routes/api-router.js'));

io.use(socketsAuth);

io.on('connection', async (socket) => {
  const { userId, connectionId } = socket;
  if (userId && connectionId) {
    addConnection(userId, connectionId);
    socket.join(userId);

    try {
      const userGroups = await GroupsDAO.getUserGroups(userId);
      const groupRooms = userGroups.map(group => `group_${group.id}`);
      if (groupRooms.length) socket.join(groupRooms);
    } catch (error) {
      console.log(error.message);
    }

    handleChatMessage(socket);

    handleChangeFriendRequestStatus(io, socket);

    handleSendFriendRequest(io, socket);

    socket.on('disconnect', () => {
      removeConnection(userId, connectionId);
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});