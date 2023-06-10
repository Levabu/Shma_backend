const UsersDAO = require("../../db/dao/usersDAO");
const endpoints = require("../../endpoints");
const { jwt } = require("../../jwt");
const { noMatch } = require("../../responseHandlers");

const auth = async (req, res, next) => {
  const baseUrl = req.url.split('?')[0];
  const endpoint = endpoints.find(endpoint => {
    return endpoint.urlTemplate.test(baseUrl) && endpoint.method === req.method
  });

  if (!endpoint || endpoint.isOpen) return next();

  const { authorization } = req.headers;
  if (!authorization) {
      return res.customSend(noMatch('User is not authorized to access this endpoint'))
  }
  try {
      const decodedValue = jwt.verify(authorization.slice(7));

      const expirationDate = new Date(decodedValue.exp * 1000);
      if (expirationDate < new Date()) {
        return res.customSend(noMatch('Session expired'))
      }

      const user = await UsersDAO.getUserById(decodedValue.id)
      if (!user) {
        return res.customSend(noMatch('User is not authorized to access this endpoint'))
      }

      req.user = decodedValue;
      return next();
  } catch(error) {
    return res.customSend(noMatch('User is not authorized to access this endpoint'))
  }
}

module.exports = auth;