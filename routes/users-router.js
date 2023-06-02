const express = require("express");
const UsersController = require("../controllers/usersController");
const router = express.Router();

router.post('/signup', UsersController.signup);
router.post('/login', UsersController.login);

// for debug, until login/signup is implemented
router.get('/:id', UsersController.getUserById);

module.exports = router;