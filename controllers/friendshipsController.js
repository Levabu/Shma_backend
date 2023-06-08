const FriendshipsDAO = require('../lib/db/dao/FriendshipsDAO');
const UsersDAO = require("../lib/db/dao/usersDAO");
const bcrypt = require("bcrypt");
const { noMatch } = require('../lib/responseHandlers');

FriendshipsDAO;
UsersDAO;

class FriendshipsController {
    static async getFriends(req, res) {
        try {
            // returns friends Ids
            const { id } = req.params;
            const friendsIds = await FriendshipsDAO.getFriendsIds(id);
            if (friendsIds) return res.ok(friendsIds);
        } catch (error) {
            res.serverErr(error)
        }
    }
    
    static async checkFriendship(req, res) {
        try {
            const { id1, id2 } = req.params;
            const friendship = await FriendshipsDAO.checkFriendship(id1,id2);
            return res.ok(friendship);
        } catch (error) {
            res.serverErr(error)
        }
    }

    static async makeFriendRequest(req, res) {
        try {
            const { fromID, toID } = req.params;
            const isRequestSuccessful = await FriendshipsDAO.makeFriendRequest(fromID, toID);
            if (isRequestSuccessful===true) {
                res.ok(true)
            } else {
                res.customSend(noMatch("Invalid Ids."))
            }
        } catch (error) {
            res.serverErr(error)
        }
    }

    static async confirmFriendship(req, res) {
        try {
            const { fromID, toID } = req.params;
            const isRequestSuccessful = await FriendshipsDAO.confirmFriendship(fromID, toID);
            if (isRequestSuccessful===true) {
                res.ok(true)
            } else {
                res.customSend(noMatch("Invalid Ids."))
            }
        } catch (error) {
            res.serverErr(error)
        }
    }
}

module.exports = FriendshipsController;