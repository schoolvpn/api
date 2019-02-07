const express = require("express");
const router = express.Router();

const UserController = require('../controllers/admin');
const checkUserAuth = require('../middleware/userauth');
const checkAdminAuth = require('../middleware/adminauth');
const checkIsOwner = require('../middleware/isowner');

router.get("/userlist", checkAdminAuth, UserController.adminUserList);

router.delete("/user/:userId", checkAdminAuth, UserController.adminUserDelete);

router.put("/user/:userId", checkAdminAuth, UserController.adminUserEdit);

module.exports = router;