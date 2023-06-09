const UsersDAO = require("../lib/db/dao/usersDAO");
const bcrypt = require("bcrypt");
const { noMatch, invalidUserName, missingParams, serverError } = require("../lib/responseHandlers");
const { jwt } = require("../lib/jwt");
const {
  PrivateMessagesDAO,
  GroupMessagesDAO,
} = require("../lib/db/dao/MessagesDAO");
const {
  aggregatePrivateMessages,
  aggregateGroupMessages,
} = require("../lib/db/utils");
const GroupsDAO = require("../lib/db/dao/GroupsDAO");
const FriendshipsDAO = require("../lib/db/dao/FriendshipsDAO");

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

      const token = jwt.sign({ id: user.id });
      user.token = token;

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

            const token = jwt.sign({ id: user.id });
            user.token = token;

            return res.ok(user);
          }
        }
        return res.customSend(noMatch("User Name or Password Incorrect"));
      } catch (error) {
        console.log(error);
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
      if (user) {
        delete user.password;
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
      const { ids, userId } = req.body;
      if (!ids)
        return res.customSend(noMatch("No array of ids were submitted."));
      const arrOfUsers = await UsersDAO.getUsersByIds(ids);
      if (arrOfUsers && arrOfUsers.length) {
        let i = 0;
        await arrOfUsers.forEach(async (user) => {
          const { id } = user;
          const friendship = await FriendshipsDAO.checkFriendship(userId, id);
          if (friendship) {
            user.relationship = friendship.status;
          } else {
            user.relationship = false;
          }
          delete user.password;
          i++;
          if (i === arrOfUsers.length - 1) {
            return res.ok(arrOfUsers);
          }
        });
      } else {
        return res.customSend(noMatch("There are no users with these ids."));
      }
    } catch (error) {
      res.serverErr(error);
    }
  }

  static async getFilteredUsers(req, res) {
    try {
      const { searchFor, userId } = req.body;
      let filteredUsers = [];
      if (searchFor && searchFor.length) {
        filteredUsers = await UsersDAO.getUsersBySearch(searchFor);
      } else {
        return res.customSend(missingParams("No text with which to filter"))
      }
      if (filteredUsers && filteredUsers.length) {
        let i = 0;
        await filteredUsers.forEach(async (user) => {
          const { id } = user;
          const friendship = await FriendshipsDAO.checkFriendship(userId, id);
          if (friendship) {
            user.relationship = friendship.status;
          } else {
            user.relationship = false;
          }
          delete user.password;
          i++;
          if (i === filteredUsers.length) {
            return res.ok(filteredUsers);
          }
        });
      }
    } catch (error) {
      res.serverErr(error);
    }
  }

  static async getUserChatHistory(req, res) {
    try {
      const history = {};
      const userId = req.user.id;
      const privateMessages = await PrivateMessagesDAO.getUserPrivateMessages(
        userId
      );
      history.private = aggregatePrivateMessages(privateMessages, userId);

      const groupMessages = await GroupMessagesDAO.getUserGroupsMessages(
        userId
      );
      history.group = aggregateGroupMessages(groupMessages, userId);
      history.userGroups = await GroupsDAO.getUserGroups(userId);
      history.friends = await FriendshipsDAO.getFriendsWithStatus(userId);
      res.ok(history);
    } catch (error) {
      console.log(error);
      res.serverErr(error);
    }
  }
}

module.exports = UsersController;
