const http = require('http');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { validResponse, createdResponse, serverError } = require('./lib/responseHandlers.js');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.customSend = (responseHandler) => res.status(responseHandler.status).send(responseHandler.payload);
  res.ok = (data) => res.customSend(validResponse(data));
  res.create = (value) => res.customSend(createdResponse(value));
  res.serverErr = (err) => res.customSend(serverError(err));
  next();
})

app.use('/users', require('./routes/users-route'));

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});