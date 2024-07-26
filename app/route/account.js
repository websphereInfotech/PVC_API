const {Router} = require("express");
const {view_all_account_group} = require("../controller/account");
const adminAuth = require("../middleware/adminAuth");

const router = Router();

router.get("/view_all_account_group",adminAuth("Accounts:view_all_account_group"), view_all_account_group);

module.exports = router;