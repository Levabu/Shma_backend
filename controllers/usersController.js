const UsersDAO = require("../lib/db/dao/usersDAO");
const bcrypt = require("bcrypt");
const { noMatch } = require("../lib/responseHandlers");

UsersDAO;
class UsersController {
  static async signup(req, res) {
    try {
      const { userName, firstName, lastName, password, confirmPassword } =
        req.body;
      const isUserNameExists = await UsersDAO.checkForUserName(userName);
      if (isUserNameExists) {
        return res.ok(
          "User name already exists. Please choose a different user name"
        );
      }
      if (password !== confirmPassword) {
        return res.ok("Passwords don't match. Please re-enter both passwords");
      }
      const id = await UsersDAO.getNextID();
      const hashedPassword = bcrypt.hashSync(password, 7);
      await UsersDAO.addUser(userName, firstName, lastName, hashedPassword);
      res.create({ userName, firstName, lastName, id });
    } catch (error) {
      res.serverErr(error);
    }
  }

  static async login(req, res) {
    try {
      const { userName, password } = req.body;
      try {
        const user = await UsersDAO.getUserByUsername(userName);
        if (user) {
          console.log(user);
          const isPasswordValid = bcrypt.compareSync(password, user.password);
          if (isPasswordValid) return res.ok(user);
        }
        return res.customSend(noMatch("User Name or Password Incorrect"));
      } catch {
        return res.customSend(noMatch("User Name or Password Incorrect"));
      }
    } catch (error) {
      res.serverErr(error);
    }
  }

  // for debug, until login/signup is implemented
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersDAO.getUserById(id);
      delete user.password;
      res.ok(user);
    } catch (error) {
      res.serverErr(error);
    }
  }
}

module.exports = UsersController;
