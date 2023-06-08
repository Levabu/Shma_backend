const UsersDAO = require("../lib/db/dao/usersDAO");
const bcrypt = require("bcrypt");
const { noMatch, invalidUserName } = require("../lib/responseHandlers");

UsersDAO;
class UsersController {
  static async signup(req, res) {
    try {
      const { userName, firstName, lastName, password, confirmPassword } =
        req.body;
      if (userName.includes(" ")) {
        return res.customSend(
          invalidUserName("User name cannot contain spaces.")
        );
      }
      const isUserNameExists = await UsersDAO.checkForUserName(userName);
      if (isUserNameExists) {
        return res.customSend(
          invalidUserName(
            "There is already an account with this user name - if this is you then login. If not, then please choose a different user name!"
          )
        );
      }
      if (password !== confirmPassword) {
        return res.customSend(noMatch("Passwords don't match."));
      }
      const hashedPassword = bcrypt.hashSync(password, 7);
      await UsersDAO.addUser(userName, firstName, lastName, hashedPassword);
      const user = await UsersDAO.getUserByUsername(userName);
      delete user.password;
      res.create(user);
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
          const isPasswordValid = bcrypt.compareSync(password, user.password);
          if (isPasswordValid) {
            delete user.password;
            return res.ok(user);
          }
        }
        return res.customSend(noMatch("User Name or Password Incorrect"));
      } catch {
        return res.customSend(noMatch("User Name or Password Incorrect"));
      }
    } catch (error) {
      res.serverErr(error);
    }
  }

  static async userDetails(req, res) {
    try {
      const { userName } = req.query;
      const user = await UsersDAO.getUserByUsername(userName);
      if (user && user.length) {
        delete user[0].password;
        return res.ok(user);
      } else {
        return res.customSend(noMatch("This user name does not exist."));
      }
    } catch (error) {
      res.serverErr(error);
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.query;
      const user = await UsersDAO.getUserById(Number(id));
      if (user && user.password) {
        delete user.password;
        return res.ok(user);
      } else {
        return res.customSend(noMatch("This id does not exist."));
      }
    } catch (error) {
      res.serverErr(error);
    }
  }

  static async getUsersByIds(req, res) {
    try {
        const { ids } = req.body;
        if (!ids) return res.customSend(noMatch("No array of ids were submitted."));
        const arrOfUsers = await UsersDAO.getUsersByIds(ids);
        if (arrOfUsers && arrOfUsers.length) {
            arrOfUsers.forEach(user => {
                delete user.password
            })
            return res.ok(arrOfUsers);
        } else {
            return res.customSend(noMatch("There are no users with these ids."))
        }
    } catch (error) {
        res.serverErr(error)
    }
  }
}

module.exports = UsersController;
