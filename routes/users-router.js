const express = require("express");
const UsersController = require("../controllers/usersController");
const { validateDto, signUpSchema, loginSchema } = require("../validate/validations");
const router = express.Router();

router.post('/signup', validateDto(signUpSchema), UsersController.signup);
router.post('/login', validateDto(loginSchema), UsersController.login);
router.get('/user-details', UsersController.userDetails);
router.get('/user-by-id', UsersController.getUserById);
router.post('/users-by-ids',UsersController.getUsersByIds);
router.get('/chat-history', UsersController.getUserChatHistory)

module.exports = router;