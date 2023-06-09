const { jwt } = require("../../jwt");

const auth = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decodedValue = jwt.verify(token);

    const expirationDate = new Date(decodedValue.exp * 1000);
    if (expirationDate < new Date()) {
      return next(new Error("Session expired"));
    }

    if (decodedValue.id !== socket.handshake.auth.userId) {
      return next(new Error("Authentication error"));
    }
  } catch (error) {
    return next(new Error("Authentication error"));
  }

  next();
};

module.exports = auth;