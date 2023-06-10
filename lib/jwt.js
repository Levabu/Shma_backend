const _jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./settings');

const jwt = {
    sign: (payload) => _jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: '12h'}),
    verify: (token) => _jwt.verify(token, JWT_SECRET_KEY)
}

module.exports = {
  jwt
};