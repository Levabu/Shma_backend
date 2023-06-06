const express = require("express");
const UsersController = require("../controllers/usersController");
const { validateDto, signUpSchema, loginSchema } = require("../validate/validations");
const router = express.Router();

router.post('/signup', validateDto(signUpSchema), UsersController.signup);
router.post('/login', validateDto(loginSchema), UsersController.login);

// for debug, until login/signup is implemented
router.get('/:id', UsersController.getUserById);

module.exports = router;