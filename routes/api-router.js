const express = require("express");
const router = express.Router();

// add other api routers here
router.use('/users', require('./users-router.js'));
router.use('/friendships', require('./friendships-router.js'));

module.exports = router;