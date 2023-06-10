const connections = {};

const addConnection = (userId, connectionId) => {
  if (!connections[userId]) {
    connections[userId] = [];
  }
  connections[userId].push(connectionId);
}

const removeConnection = (userId, connectionId) => {
  if (!connections[userId]) {
    return;
  }
  connections[userId] = connections[userId].filter((connection) => connection !== connectionId);
}

const getUserConnections = (userId) => {
  if (!connections[userId]) return [];
  return connections[userId];
}

const getUserConnectionsCount = (userId) => {
  return getUserConnections(userId).length;
}

module.exports = {
  addConnection,
  removeConnection,
  getUserConnections,
  getUserConnectionsCount
}