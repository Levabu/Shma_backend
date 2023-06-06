const _jwt = require('jsonwebtoken')

const privateKey = process.env.JWT_SECRET_KEY
console.log('privateKey', privateKey)
const jwt = {
    sign: (payload) => _jwt.sign(payload, privateKey, {expiresIn: '12h'}),
    verify: (token) => _jwt.verify(token, privateKey)
  }

module.exports = jwt;