const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const { validation } = require("../views/validate");
const {
  admin_login,
  user_login,
  create_user,
} = require("../controller/admincontroller");

router.post("/admin_login", validation("userLogin"), admin_login);
router.post("/create_user", adminAuth("Login:create_user"), create_user);
router.post("/user_login", user_login);
module.exports = router;
