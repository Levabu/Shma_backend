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
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UsersDAO.getUserById(id);
            delete user.password;
            res.ok(user);
        } catch (error) {
            res.serverErr(error)
        }
    }
}

module.exports = UsersController;