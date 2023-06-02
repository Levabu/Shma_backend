const UsersDAO = require("../lib/db/dao/usersDAO");

UsersDAO
class UsersController {
    static async signup(req, res) {
        try {

        } catch (error) {
            res.serverErr(error)
        }
    }

    static async login(req, res) {
        try {

        } catch (error) {
            res.serverErr(error)
        }
    }

    // for debug, until login/signup is implemented
    static async getUserByUsername(req, res) {
        try {
            const { userName } = req.params;
            console.log(UsersDAO);
            const user = await UsersDAO.getUserByUsername(userName);
            delete user.password;
            res.ok(user);
        } catch (error) {
            res.serverErr(error)
        }
    }
}

module.exports = UsersController;