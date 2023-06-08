const express = require("express");
const FriendshipsController = require("../controllers/friendshipsController");

const router = express.Router();

router.get("/friends/:id", FriendshipsController.getFriends);
router.get("/check-friendship/:id1/:id2", FriendshipsController.checkFriendship);
router.post(
  "/friend-request/:fromID/:toID",
  FriendshipsController.makeFriendRequest
);
router.patch(
  "/confirm-friendship/:fromID/:toID",
  FriendshipsController.confirmFriendship
);

module.exports = router;
