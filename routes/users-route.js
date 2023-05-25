const express = require("express");
const UsersController = require("../controllers/usersController");
const route = express.Router();

route.post('/signup', UsersController.signup);
route.post('/login', UsersController.login);

module.exports = route;