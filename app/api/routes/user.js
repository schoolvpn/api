const express = require("express");
const router = express.Router();

var ExpressBrute = require('express-brute');
var MongooseStore = require('express-brute-mongoose');
var bruteSchema = require('../models/brute');
var store = new MongooseStore(bruteSchema);
var bruteforce = new ExpressBrute(store);

const UserController = require('../controllers/user');
const checkUserAuth = require('../middleware/userauth');
const checkAdminAuth = require('../middleware/adminauth');
const checkIsOwner = require('../middleware/isowner');

// router.post("/signup", bruteforce.prevent, UserController.user_signup);
router.post("/signup", UserController.userSignup);

// router.post("/login", bruteforce.prevent, UserController.user_login);
router.post("/login", UserController.userLogin);

router.get("/me", checkIsOwner, UserController.userMe);

router.put("/me", checkIsOwner, UserController.userEditme);

router.post("/changepassword", checkIsOwner, UserController.userChangepassword);

module.exports = router;