const http = require('http');

const express = require('express');
const cors = require('cors');
const { validResponse, createdResponse, serverError } = require('./lib/responseHandlers.js');
const httpAuth = require('./lib/middlewares/http/auth.js');
const socketsAuth = require('./lib/middlewares/sockets/auth.js');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const { PORT } = require('./lib/settings.js');
const { handleChatMessage, handleLoadChatHistory } = require('./sockets/events.js');
const { addConnection, removeConnection } = require('./sockets/connections.js');
const {db} = require('./lib/db/db.js');
const { PrivateMessagesDAO } = require('./lib/db/dao/MessagesDAO.js');
const GroupsDAO = require('./lib/db/dao/GroupsDAO.js');
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
  addConnection(userId, connectionId);
  socket.join(userId);

  const userGroups = await GroupsDAO.getUserGroups(userId);
  const groupRooms = userGroups.map(group => `group_${group.id}`);
  if (groupRooms.length) socket.join(groupRooms);

  handleLoadChatHistory(socket);

  handleChatMessage(socket);

  socket.on('disconnect', () => {
    removeConnection(userId, connectionId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});