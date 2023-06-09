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
  console.log('endpoint', endpoint)
  const { authorization } = req.headers;
  if (!authorization) {
      return res.customSend(noMatch('User is not authorized to access this endpoint'))
  }
  try {
      const decodedValue = jwt.verify(authorization.slice(7));
      console.log('decodedValue', decodedValue)
      const expirationDate = new Date(decodedValue.exp * 1000);
      if (expirationDate < new Date()) {
        return res.customSend(noMatch('Session expired'))
      }
      console.log('decodedValue.id', decodedValue.id)
      const user = await UsersDAO.getUserById(decodedValue.id)
      if (!user) {
        return res.customSend(noMatch('User is not authorized to access this endpoint'))
      }
      console.log('user', user)
      req.user = decodedValue;
      return next();
  } catch(error) {
    console.log('error', error)
    return res.customSend(noMatch('User is not authorized to access this endpoint'))
  }
}

module.exports = auth;