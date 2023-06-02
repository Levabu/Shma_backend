const express = require("express");
const UsersController = require("../controllers/usersController");
const route = express.Router();

route.post('/signup', UsersController.signup);
route.post('/login', UsersController.login);

// for debug, until login/signup is implemented
route.get('/:userName', UsersController.getUserByUsername);

module.exports = route;